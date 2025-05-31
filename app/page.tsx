import { Button } from "@/components/ui/button";
import Link from "next/link";
import Info from "./chat/info";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-10 text-center w-screen h-screen items-center justify-center text-xl p-10">
      Olá, este é meu aplicativo pessoal, ele é um chat que mostra informações profissionais sobre mim. Você pode usá-lo para conversar comigo
      <Link href={'/chat'}><Button variant={`outline`}>Ir para o Chat</Button></Link>
          <div className="mt-10 w-1/3 flex justify-center">
      <Info></Info>
    </div>
    </div>
  );
}
