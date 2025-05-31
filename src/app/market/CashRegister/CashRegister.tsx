import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { MarketStore } from "../MarketStore"

const CashRegister = observer(() => {
  return (
    <div className="text-white bg-[#1a1a1a] mt-10 h-[500px] rounded-2xl overflow-hidden flex flex-col items-center mx-5 p-6 shadow-xl border border-[#2d2d2d]">
      <h2 className="text-2xl font-bold mb-2 text-yellow-300 pb-5">
        <span
          onClick={() => MarketStore.setBuyMode(true)}
          className={
            !MarketStore.buyMode
              ? "text-gray-500 cursor-pointer"
              : "cursor-pointer"
          }
        >
          Buy{" "}
        </span>
        or
        <span
          onClick={() => MarketStore.setBuyMode(false)}
          className={
            MarketStore.buyMode
              ? "text-gray-500 cursor-pointer"
              : "cursor-pointer"
          }
        >
          {" "}
          Sell{" "}
        </span>
        Crypto
      </h2>

      <div className="w-full max-w-md">
        <form className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="spend"
              className="block text-sm font-medium text-gray-300"
            >
              Списать
            </label>
            <div className="relative rounded-lg bg-[#2d2d2d] border border-[#3d3d3d]">
              {!MarketStore.buyMode ? (
                <input
                  className="w-full bg-transparent py-3 px-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  id="spend"
                  placeholder="0.00"
                  value={
                    MarketStore.currencyValue === undefined ||
                    MarketStore.currencyValue === ""
                      ? ""
                      : MarketStore.currencyValue
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    // Если строка пустая → передаем undefined или ""
                    if (value === "") {
                      MarketStore.setCurrencyValue("") // или undefined
                    }
                    // Если число (включая 0) → передаем как число
                    else {
                      MarketStore.setCurrencyValue(Number(value))
                    }
                  }}
                />
              ) : (
                <input
                  className="w-full bg-transparent py-3 px-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  id="spend"
                  placeholder="0.00"
                  value={
                    MarketStore.spendValue === undefined ||
                    MarketStore.spendValue === ""
                      ? ""
                      : MarketStore.spendValue
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    // Если строка пустая → передаем undefined или ""
                    if (value === "") {
                      MarketStore.setSpendValue("") // или undefined
                    }
                    // Если число (включая 0) → передаем как число
                    else {
                      MarketStore.setSpendValue(Number(value))
                    }
                  }}
                />
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 text-sm">
                  {MarketStore.buyMode ? "USDT" : MarketStore.currencyId}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="receive"
              className="block text-sm font-medium text-gray-300"
            >
              Получить
            </label>
            <div className="relative rounded-lg bg-[#2d2d2d] border border-[#3d3d3d]">
              {MarketStore.buyMode ? (
                <input
                  className="w-full bg-transparent py-3 px-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  id="receive"
                  placeholder="0.00"
                  value={
                    MarketStore.currencyValue === undefined ||
                    MarketStore.currencyValue === ""
                      ? ""
                      : MarketStore.currencyValue
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    // Если строка пустая → передаем undefined или ""
                    if (value === "") {
                      MarketStore.setCurrencyValue("") // или undefined
                    }
                    // Если число (включая 0) → передаем как число
                    else {
                      MarketStore.setCurrencyValue(Number(value))
                    }
                  }}
                />
              ) : (
                <input
                  className="w-full bg-transparent py-3 px-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  id="receive"
                  placeholder="0.00"
                  value={
                    MarketStore.spendValue === undefined ||
                    MarketStore.spendValue === ""
                      ? ""
                      : MarketStore.spendValue
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    // Если строка пустая → передаем undefined или ""
                    if (value === "") {
                      MarketStore.setSpendValue("") // или undefined
                    }
                    // Если число (включая 0) → передаем как число
                    else {
                      MarketStore.setSpendValue(Number(value))
                    }
                  }}
                />
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 text-sm">
                  {MarketStore.buyMode ? MarketStore.currencyId : "USDT"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-[70%]">
            <button
              onClick={
                MarketStore.buyMode
                  ? (e) => {
                      e.preventDefault()
                      MarketStore.buyCurrency()
                    }
                  : (e) => {
                      e.preventDefault()
                      MarketStore.sellCurrency()
                    }
              }
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center cursor-pointer"
            >
              {MarketStore.buyMode ? "Купить" : "Продать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default CashRegister
