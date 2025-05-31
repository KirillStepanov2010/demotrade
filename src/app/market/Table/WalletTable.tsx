import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useMemo, useState } from "react"
import { useWalletCurrencies } from "./useWalletCurrencies"
import { MarketStore } from "../MarketStore"
import { Table, Tbody, Th, Thead, Tr } from "./TableComponents"
import { colTitles, visColsWallet, walletTableTitles } from "./tableTitles"
import { cellHandler } from "./TableHandlers"
import { observer } from "mobx-react-lite"

const WalletTable = observer(() => {
  const walletIds = Object.keys(MarketStore.wallet)
  const { data, isLoading, isError, error } = useWalletCurrencies(walletIds)
  const [walletData, setWalletData] = useState(data || []) // Добавил fallback на случай, если data undefined

  useEffect(() => {
    if (data) {
      setWalletData(
        data.map((e) => {
          const spendSum = (MarketStore.purchaseHistory[e.id] || []).reduce(
            (sum, item) => sum + (Number(item.spend) || 0),
            0
          )

          return {
            ...e,
            onBalance: MarketStore.wallet[e.id] || 0,
            spendSum,
            profit: (
              MarketStore.wallet[e.id] * e.current_price -
              spendSum
            ).toFixed(3),
          }
        })
      )
    }
  }, [MarketStore.wallet, data])

  const tableHeaders = useMemo(
    () =>
      Object.entries(walletTableTitles).map(([key, val]) => {
        return (
          <Th key={key} className="p-5">
            {val}
          </Th>
        )
      }),
    []
  )

  const tableRows = useMemo(
    () =>
      walletData?.map((row) => (
        <Tr
          key={row.id}
          onClick={() => MarketStore.setCurrency(row.id, row.current_price)}
        >
          {visColsWallet.map((coll) => cellHandler(row, coll))}
        </Tr>
      )),
    [walletData]
  )

  if (isLoading)
    return (
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    )
  if (isError) return <div className="text-red-400">{error.message}</div>

  return (
    <div className="overflow-auto max-h-[90vh]">
      <Table>
        <Thead>
          <Tr>{tableHeaders}</Tr>
        </Thead>
        <Tbody>{tableRows}</Tbody>
      </Table>
    </div>
  )
})

export default WalletTable
