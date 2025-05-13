import Image from "next/image"
import React from "react"
import { CryptoCurrency } from "./useCryptos"

// Константы для проверки типов колонок
const DATE_COLUMNS = new Set(["ath_date", "atl_date", "last_updated"])
const CHANGE_COLUMNS = new Set([
  "price_change_24h",
  "price_change_percentage_24h",
  "market_cap_change_24h",
  "market_cap_change_percentage_24h",
  "ath_change_percentage",
  "atl_change_percentage",
])

// Мемоизированные компоненты ячеек
const ImageCell = ({ src, alt }: { src: string; alt: string }) => {
  if (src.startsWith("https"))
    return (
      <td>
        <Image src={src} width={40} height={40} alt={alt} loading="lazy" />
      </td>
    )
  else {
    return <td>Фото отсутствует</td>
  }
}

const DateCell = ({ date }: { date: string }) => (
  <td>{new Date(date).toLocaleString()}</td>
)

const ChangeCell = ({ value }: { value: number }) => {
  const isPositive = value >= 0
  return (
    <td className={isPositive ? "text-green-600 " : "text-red-600"}>
      {isPositive
        ? `+${value.toFixed(3).replace(/\.?0+$/, "")}`
        : value.toFixed(3).replace(/\.?0+$/, "")}
    </td>
  )
}

const NumberCell = ({ value }: { value: number | string }) => (
  <td>
    {typeof value === "number" ? value.toFixed(3).replace(/\.?0+$/, "") : value}
  </td>
)

// Основная функция обработки ячеек
export const cellHandler = (row: CryptoCurrency, coll: string) => {
  const cellKey = `${row.id}_${coll}`

  if (coll === "image") {
    return <ImageCell key={cellKey} src={row[coll]} alt={`${row.name} logo`} />
  }

  if (DATE_COLUMNS.has(coll)) {
    return <DateCell key={cellKey} date={row[coll]} />
  }

  if (CHANGE_COLUMNS.has(coll)) {
    return <ChangeCell key={cellKey} value={Number(row[coll])} />
  }

  return <NumberCell key={cellKey} value={row[coll]} />
}
