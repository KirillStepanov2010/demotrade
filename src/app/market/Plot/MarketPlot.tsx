import { useQuery } from "@tanstack/react-query"
import {
  createChart,
  ColorType,
  CandlestickSeries,
  UTCTimestamp,
} from "lightweight-charts"
import { useEffect, useRef } from "react"

const MarketPlot = () => {
  // Цветовая схема
  const colors = {
    background: "#1a1a1a",
    text: "#e0e0e0",
    grid: "#2a2e39",
    upCandle: "#26a69a",
    downCandle: "#ef5350",
    upWick: "#26a69a",
    downWick: "#ef5350",
    border: "rgba(42, 46, 57, 0)",
    crosshair: "#758696",
  }

  interface OHLCData {
    time: UTCTimestamp
    open: number
    high: number
    low: number
    close: number
  }

  const fetchCurrency = async (): Promise<OHLCData[]> => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1",
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currency"],
    queryFn: fetchCurrency,
  })

  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        mode: 0, // 0 - нормальный режим, 1 - подвижный, 2 - скрытый
        vertLine: {
          color: colors.crosshair,
          width: 1,
          style: 0, // 0 - сплошная, 1 - пунктир, 2 - точки
          visible: true,
          labelVisible: true,
          labelBackgroundColor: colors.background,
        },
        horzLine: {
          color: colors.crosshair,
          width: 1,
          style: 0,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: colors.background,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000)
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        },
      },
      localization: {
        timeFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000)
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        },
      },

      width: chartContainerRef.current.clientWidth,
      height: 500,
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: colors.upCandle,
      downColor: colors.downCandle,
      borderVisible: false,
      wickUpColor: colors.upWick,
      wickDownColor: colors.downWick,
    })

    candlestickSeries.setData(data)
    chart.timeScale().fitContent()

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [data])

  if (isLoading) return <div className="loading">Loading...</div>
  if (isError) return <div className="error">Error: {error?.message}</div>
  if (!data || data.length === 0) return <div>No data available</div>

  return (
    <div
      ref={chartContainerRef}
      className="mt-10 w-full h-[500px] rounded-2xl overflow-hidden"
    />
  )
}

export default MarketPlot
