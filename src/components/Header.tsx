"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { LoginForm } from "./LoginForm"
import Link from "next/link"

const Header = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <header className="bg-violet-400 flex justify-center items-center h-[50px]">
        <div className="w-11/12 flex justify-between">
          <div className="flex justify-center gap-10 items-center">
            <Link href="/market" className="hover:scale-105">
              Рынок валюты
            </Link>
            <div>Пункт 2</div>
            <div>Пункт 3</div>
          </div>
          <div className="flex gap-5">
            <div className="flex items-center justify-center gap-5">
              <div>BTC</div>
              <div>USDT</div>
            </div>
            <Button
              onClick={(): void => setVisible(!visible)}
              className="cursor-pointer"
            >
              Войти
            </Button>
          </div>
        </div>
      </header>
      <div
        className={
          visible
            ? "flex min-h-svh w-full items-center justify-center p-6 md:p-10 absolute"
            : "hidden"
        }
      >
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Header
