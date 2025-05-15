import { useQuery } from "@tanstack/react-query"
import { OhlcData, UTCTimestamp } from "lightweight-charts"
import { Bitcoin } from "lucide-react"

interface OHLCData {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
}

const fetchCurrency = async (id: string): Promise<OHLCData[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=1`,
    {
      headers: {
        "x-cg-demo-api-key": "CG-EYJWGwn66nia1SakgUULH4X4",
        "Content-Type": "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: number[][] = await response.json()
  return data.map((item) => ({
    time: Math.floor(item[0] / 1000) as UTCTimestamp,
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
  }))
}

export const usePlotData = (id: string = "bitcoin") => {
  return useQuery({
    queryKey: ["currency", id],
    queryFn: () => fetchCurrency(id),
  })
}
