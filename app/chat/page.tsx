"use client";
import React, { useState, useRef, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

type Message = {
  text: string;
  time: string;
  sender: "você" | "admin";
  error?: boolean;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isServerUp, setIsServerUp] = useState(true);

  useEffect(() => {
    getServerStatus();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function getServerStatus() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/hello`);
    } catch {
      setIsServerUp(false);
      toast(`Servidor indisponível`)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = { text: input, time, sender: "você" as const };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input }),
        }
      );
      const data = await res.json();
      console.log(data);
      const nowAdmin = new Date();
      const timeAdmin = nowAdmin.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Processa a resposta da API com base em sua estrutura
      let responseText = "Sem resposta";
      if (Array.isArray(data)) {
        // Se for um array de strings, junta tudo
        responseText = data.join("\n");
      } else if (data && typeof data === "object") {
        // Se for um objeto com propriedade answer
        responseText =
          data.answer || data.response || data.message || JSON.stringify(data);
      } else if (data && typeof data === "string") {
        // Se for direto uma string
        responseText = data;
      }

      setMessages((prev) => [
        ...prev,
        { text: responseText, time: timeAdmin, sender: "admin" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Não foi possível obter resposta.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: "admin",
          error: true,
        } as Message, 
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isServerUp){
    return <div className="flex flex-col items-center h-screen w-full justify-center text-2xl p-10 text-center">
      Este projeto não está disponível no momento. Por favor, tente mais tarde.
      <CircleAlert className="text-red-500 h-6 w-6 inline-flex animate-pulse"/>
    </div>
  }
  return (
    <div className="flex items-center justify-center h-[100vh] bg-gray-100">
      <div className="w-full max-w-md bg-white rounded shadow p-4 flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto mb-4 border-b flex flex-col items-end">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-10 w-full">
              Nenhuma mensagem ainda.
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 p-2 rounded max-w-xs w-fit \
                  ${
                    msg.sender === "você"
                      ? "bg-blue-100 self-end"
                      : msg.error
                      ? "bg-red-100 text-red-700 border border-red-400 self-start"
                      : "bg-gray-200 self-start"
                  }`}
              >
                <div className="font-semibold text-xs mb-1">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {msg.time}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="my-2 p-2 bg-gray-200 rounded max-w-xs w-fit self-start animate-pulse">
              <div className="font-semibold text-xs mb-1">admin</div>
              <div>Digitando...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className={`flex-1 border rounded px-2 py-1 ${
              loading && "bg-zinc-200 text-white"
            }`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              loading ? "Admin está digitando" : "Pergunte o que quiser"
            }
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
