import React, { useRef, useState, useMemo, useCallback, useEffect } from "react"
import { useCryptos } from "@/app/market/Table/useCryptos"
import { cellHandler } from "./TableHandlers"
import { colTitles, sortableCols, visCols } from "./tableTitles"
import { useInfiniteScroll } from "./UseInfinitieScroll"
import { usePlotData } from "../Plot/UsePlotData"
import { MarketStore } from "../MarketStore"
import { Table, Tbody, Th, Thead, Tr } from "./TableComponents"

const MarketTable = () => {
  const [sortKey, setSortKey] = useState<null | string>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  console.log(MarketStore.purchaseHistory)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCryptos(sortKey, sortOrder)

  const refContainer = useRef<HTMLDivElement>(null)

  useInfiniteScroll({
    ref: refContainer,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 100,
    throttleDelay: 700,
  })

  // Мемоизированные данные
  const allCryptos = useMemo(() => data?.pages.flat() || [], [data?.pages])

  // Обработчик сортировки
  const handleSort = useCallback(
    (key: string) => {
      if (!sortableCols.includes(key)) return

      if (sortKey === key) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        setSortKey(key)
        setSortOrder("asc")
      }
    },
    [sortKey]
  )

  // Мемоизированные заголовки таблицы с правильным типом
  const tableHeaders = useMemo(
    () =>
      Object.entries(colTitles).map(([key, val]) => {
        const isActive = sortKey === key
        return (
          <Th key={key} className="p-5" onClick={() => handleSort(key)}>
            {val}
            {isActive && (sortOrder === "asc" ? " ▲" : " ▼")}
          </Th>
        )
      }),
    [sortKey, sortOrder, handleSort]
  ) as React.ReactNode[]

  // Мемоизированные строки таблицы
  const tableRows = useMemo(
    () =>
      allCryptos.map((row) => (
        <Tr
          key={row.id}
          onClick={() => MarketStore.setCurrency(row.id, row.current_price)}
        >
          {visCols.map((coll) => cellHandler(row, coll))}
        </Tr>
      )),
    [allCryptos]
  )

  const isInitialSet = useRef(false) // Флаг первого выполнения

  useEffect(() => {
    if (allCryptos.length > 1 && !isInitialSet.current) {
      MarketStore.setCurrency(allCryptos[0].id, allCryptos[0].current_price)
      isInitialSet.current = true // Помечаем, что установка произошла чтобы при загрузке данных выбрать начальную валюту в маркетстор
    }
  }, [allCryptos])

  if (isLoading || !data) return <div>Loading...</div>
  if (isError) return <div>Error: {error?.message}</div>
  if (allCryptos.length === 0) return <div>No data available</div>

  return (
    <div className="overflow-auto max-h-[90vh]" ref={refContainer}>
      <Table>
        <Thead>
          <Tr>{tableHeaders}</Tr>
        </Thead>
        <Tbody>{tableRows}</Tbody>
      </Table>
    </div>
  )
}

export default MarketTable
