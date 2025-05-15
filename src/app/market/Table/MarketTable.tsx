import React, { useRef, useState, useMemo, useCallback } from "react"
import { useCryptos } from "@/app/market/Table/useCryptos"
import { cellHandler } from "./TableHandlers"
import { colTitles, sortableCols, visCols } from "./tableTitles"
import { useInfiniteScroll } from "./UseInfinitieScroll"
import { usePlotData } from "../Plot/UsePlotData"
import { MarketStore } from "../MarketStore"

const Table = React.memo(({ children }: { children: React.ReactNode }) => (
  <table className="max-w-screen">{children}</table>
))
const Thead = React.memo(({ children }: { children: React.ReactNode }) => (
  <thead>{children}</thead>
))
const Tbody = React.memo(({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
))
const Tr = React.memo(
  ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <tr onClick={onClick}>{children}</tr>
)
const Th = React.memo(
  ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <th onClick={onClick} className={className}>
      {children}
    </th>
  )
)

const MarketTable = () => {
  const [sortKey, setSortKey] = useState<null | string>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

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
        <Tr key={row.id} onClick={() => MarketStore.setCurrencyId(row.id)}>
          {visCols.map((coll) => cellHandler(row, coll))}
        </Tr>
      )),
    [allCryptos]
  )

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
