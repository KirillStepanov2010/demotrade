import { useQuery } from "@tanstack/react-query"
import { CryptoCurrency } from "./useCryptos"

const fetchWalletCurencies = async (
  ids: string[]
): Promise<CryptoCurrency[]> => {
  const idsString = ids.join("%2C")
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsString}`,
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
  } catch (e) {
    throw new Error(`Ошибка получения данных${e}`)
  }
}

export const useWalletCurrencies = (ids: string[]) => {
  return useQuery({
    queryKey: ["walletCurrencies"],
    queryFn: () => fetchWalletCurencies(ids),
  })
}
