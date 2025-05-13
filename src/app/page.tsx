import Image from "next/image"
import meme from "../Images/502faddccf.jpg"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-11/12">
        <div className="mt-10 flex justify-center items-center flex-col">
          <div>Добро пожаловать в мир трейдинга без высоких ставок</div>
          <Image
            src={meme}
            alt="Трейдинг мем" // Обязательное поле
            width={500} // Обязательно укажите ширину
            height={300} // Обязательно укажите высоту
            className="mt-4" // Дополнительные стили
          />
          <div>
            Бесплатно тренируйтесь в трейдинге, копите деньги когда будете
            уверены в своей победе порвите рынок криптовалют.
          </div>
          <div className="mt-5">
            <Button>Ворваться</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
