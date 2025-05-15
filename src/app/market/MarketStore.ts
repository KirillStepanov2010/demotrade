import { makeAutoObservable } from "mobx"

export function CreateMarketStore() {
  return makeAutoObservable({
    currencyId: "bitcoin",
    setCurrencyId(id: string) {
      this.currencyId = id
    },
  })
}

export const MarketStore = CreateMarketStore()
