"use client"
import MarketTable from "@/app/market/Table/MarketTable"
import MarketPlot from "@/app/market/Plot/MarketPlot"
import CashRegister from "./CashRegister/CashRegister"
import { MarketStore } from "./MarketStore"
import WalletTable from "./Table/WalletTable"
import { observer } from "mobx-react-lite"

const Market = observer(() => {
  return MarketStore.buyMode ? (
    <div className="flex items-center justify-center">
      <div className="w-11/12">
        <div className="flex items-stretch">
          <MarketPlot />
          <CashRegister />
        </div>
        <MarketTable />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="w-11/12">
        <div className="flex items-stretch">
          {/* <CryptoChartWithTable /> */}
          <CashRegister />
        </div>
        <WalletTable />
      </div>
    </div>
  )
})

export default Market
