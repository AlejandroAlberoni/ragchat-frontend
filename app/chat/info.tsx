import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import React from "react";

const Info = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Sobre o Chat</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Este chat foi desenvolvido para que qualquer pessoa possa tirar
            dúvidas sobre o meu currículo de forma interativa e rápida. Basta
            digitar sua pergunta e o sistema irá buscar as informações mais
            relevantes presentes no meu currículo.
          </p>
          <p>
            O diferencial deste chat é o uso de{" "}
            <b>busca semântica</b> para encontrar as respostas. Isso significa
            que, ao invés de procurar apenas por palavras exatas, o sistema
            entende o significado da sua pergunta e localiza trechos do currículo
            que realmente respondem ao que você quer saber.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Como funciona a busca semântica?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            A busca semântica utiliza modelos de linguagem para transformar tanto
            as perguntas dos usuários quanto os textos do currículo em vetores
            numéricos (embeddings). Assim, ao receber uma pergunta, o sistema
            compara esses vetores e retorna os trechos mais próximos em
            significado, mesmo que as palavras usadas sejam diferentes.
          </p>
          <p>
            Esse processo é chamado de <b>semantic retrieval</b> e é muito
            eficiente para perguntas abertas, pois entende contexto e sinônimos,
            tornando a experiência muito mais natural.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Por que é mais eficiente que um LLM?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Diferente de um LLM (Large Language Model) completo, que precisa
            processar toda a entrada e gerar uma resposta do zero, a busca
            semântica apenas compara vetores e faz o <b>retrieve</b> dos textos
            mais relevantes já existentes. Isso consome muito menos recursos
            computacionais, é mais rápido e escalável, especialmente para
            perguntas sobre um conjunto fixo de informações como um currículo.
          </p>
          <p>
            Após a busca, o sistema pode até usar um modelo menor para gerar uma
            resposta mais natural, mas o trabalho pesado de encontrar a
            informação já foi feito de forma otimizada pela busca semântica.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Info;
