import { makeAutoObservable } from "mobx"
import { CryptoCurrency } from "./Table/useCryptos"

class CreateMarketStore {
  constructor() {
    makeAutoObservable(this)
    this.getHistory()
    this.getWallet()
  }
  buyMode: boolean = true
  currencyId: string = "bitcoin"
  currencyPrice: number = 0
  spendValue: number | string = ""
  currencyValue: number | string = ""
  wallet: Record<string, number> = {}
  purchaseHistory: Record<string, Array<Record<string, number | string>>> = {}

  setBuyMode = (mode: boolean) => {
    this.buyMode = mode
  }

  setSpendValue = (value: number | string) => {
    if (typeof value === "string") {
      this.spendValue = value
      this.currencyValue = ""
    } else {
      this.spendValue = value
      this.currencyValue = (
        Math.floor(((this.spendValue * 0.998) / this.currencyPrice) * 10 ** 8) /
        10 ** 8
      ).toFixed(8)
    }
  }

  setCurrencyValue = (value: number | string) => {
    if (typeof value === "string") {
      this.currencyValue = value
      this.spendValue = ""
    } else {
      this.currencyValue = value
      this.spendValue = (
        Math.ceil(
          ((this.currencyValue * this.currencyPrice) / 0.998) * 10 ** 3
        ) *
        10 ** -3
      ).toFixed(3)
    }
  }

  setCurrency = (currency: string, currencyPrice: number) => {
    this.currencyId = currency
    this.currencyPrice = currencyPrice
    this.spendValue = ""
    this.currencyValue = ""
  }

  getHistory = () => {
    try {
      this.purchaseHistory = JSON.parse(
        localStorage.getItem("purchaseHistory") || "{}"
      )
    } catch (e) {
      this.purchaseHistory = {}
    }
  }

  getWallet = () => {
    try {
      this.wallet = JSON.parse(
        localStorage.getItem("wallet") || '{"usdt":10000}'
      )
    } catch (e) {
      this.wallet = { usdt: 10000 }
    }
  }

  buyCurrency = () => {
    // Проверка на пустые значения
    if (this.spendValue === "" || this.currencyValue === "") {
      return "Проверьте сумму"
    }

    const spendNum = Number(this.spendValue)
    const currencyNum = Number(this.currencyValue)

    // Проверка на валидность чисел
    if (isNaN(spendNum) || isNaN(currencyNum)) {
      return "Некорректная сумма"
    }

    // Проверка на достаточность средств
    if (this.wallet.usdt < spendNum) {
      return "Недостаточно средств"
    }

    // Проверка на наличие валюты в кошельке
    if (currencyNum <= 0) {
      return "Некорректное количество валюты"
    }

    // Создаем новую запись о покупке
    const newPurchase = {
      date: Date.now(),
      spend: spendNum.toFixed(3),
      buy: currencyNum.toFixed(8),
      price: this.currencyPrice,
    }

    // Обновляем историю покупок
    if (!this.purchaseHistory[this.currencyId]) {
      this.purchaseHistory[this.currencyId] = []
    }
    this.purchaseHistory[this.currencyId].push(newPurchase)

    // Обновляем кошелек
    this.wallet = {
      ...this.wallet,
      usdt: parseFloat((this.wallet.usdt - spendNum).toFixed(3)),
      [this.currencyId]: parseFloat(
        ((this.wallet[this.currencyId] || 0) + currencyNum).toFixed(8)
      ),
    }

    // Сохраняем в localStorage
    localStorage.setItem(
      "purchaseHistory",
      JSON.stringify(this.purchaseHistory)
    )
    localStorage.setItem("wallet", JSON.stringify(this.wallet))

    // Сбрасываем значения полей
    this.spendValue = ""
    this.currencyValue = ""

    return "Покупка успешно завершена"
  }

  sellCurrency = () => {
    if (this.spendValue === "" || this.currencyValue === "") {
      return "Проверьте сумму"
    }

    const spendNum = Number(this.spendValue)
    const currencyNum = Number(this.currencyValue)

    if (isNaN(spendNum) || isNaN(currencyNum)) {
      return "Некорректная сумма"
    }

    // Проверка на наличие достаточного количества валюты для продажи
    if ((this.wallet[this.currencyId] || 0) < currencyNum) {
      return "Недостаточно валюты для продажи"
    }

    const newPurchase = {
      date: Date.now(),
      currency: this.currencyId,
      sell: currencyNum.toFixed(8),
      get: spendNum.toFixed(3),
      price: this.currencyPrice,
    }

    // Обновляем историю
    if (!this.purchaseHistory[this.currencyId]) {
      this.purchaseHistory[this.currencyId] = []
    }
    this.purchaseHistory[this.currencyId].push(newPurchase)

    // Обновляем кошелек
    this.wallet = {
      ...this.wallet,
      usdt: parseFloat((this.wallet.usdt + spendNum).toFixed(3)),
      [this.currencyId]: parseFloat(
        ((this.wallet[this.currencyId] || 0) - currencyNum).toFixed(8)
      ),
    }

    if (this.wallet[this.currencyId] === 0) {
      delete this.wallet[this.currencyId]
    }

    // Сохраняем изменения
    localStorage.setItem(
      "purchaseHistory",
      JSON.stringify(this.purchaseHistory)
    )
    localStorage.setItem("wallet", JSON.stringify(this.wallet))

    // Сбрасываем значения
    this.spendValue = ""
    this.currencyValue = ""

    return "Продажа успешно завершена"
  }
}

export const MarketStore = new CreateMarketStore()
