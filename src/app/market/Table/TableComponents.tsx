import React from "react"

export const Table = React.memo(
  ({ children }: { children: React.ReactNode }) => (
    <table className="max-w-screen">{children}</table>
  )
)
export const Thead = React.memo(
  ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>
)
export const Tbody = React.memo(
  ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>
)
export const Tr = React.memo(
  ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <tr onClick={onClick}>{children}</tr>
)
export const Th = React.memo(
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
