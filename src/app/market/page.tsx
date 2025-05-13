"use client"
import MarketTable from "@/app/market/Table/MarketTable"
import MarketPlot from "@/app/market/Plot/MarketPlot"

const Market = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-11/12">
        <MarketPlot />
        <MarketTable />
      </div>
    </div>
  )
}

export default Market
