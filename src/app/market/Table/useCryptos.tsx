import { useInfiniteQuery } from "@tanstack/react-query"

export interface CryptoCurrency {
  // Основные идентификаторы
  id: string
  symbol: string
  name: string
  image: string

  // Текущие метрики
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  total_volume: number

  // Исторические экстремумы
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string

  // Предложение монет
  circulating_supply: number
  total_supply: number
  max_supply: number
  fully_diluted_valuation: number

  // 24-часовые данные
  high_24h: number
  low_24h: number

  // Дополнительные данные
  last_updated: string
  roi: null | {
    currency: string
    percentage: number
    times: number
  }

  // Для совместимости с возможными дополнительными полями
  [key: string]: any
}

const fetchCryptosTable = async (
  pageParam: number,
  col: string | null,
  order: "asc" | "desc"
): Promise<CryptoCurrency[]> => {
  if (col == "total_volume") {
    col = "volume"
  }
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${col}_${order}&page=${pageParam}`,
    {
      headers: {
        "x-cg-demo-api-key": "CG-EYJWGwn66nia1SakgUULH4X4",
        accept: "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const useCryptos = (col: string | null, order: "asc" | "desc") => {
  return useInfiniteQuery({
    queryKey: ["cryptos", col, order],
    queryFn: ({ pageParam }) => fetchCryptosTable(pageParam, col, order),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Возвращаем следующий pageParam или undefined, если данных больше нет
      return lastPage.length === 100 ? allPages.length + 1 : undefined
    },
  })
}
