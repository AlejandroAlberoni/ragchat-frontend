"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";

const COOLDOWN_KEY = "login_email_cooldown";

const page = () => {
  const [cooldown, setCooldown] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const lastSent = localStorage.getItem(COOLDOWN_KEY);
    if (lastSent) {
      const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
      if (diff < 3600) {
        setCooldown(3600 - diff);
      }
    }
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendLink = async () => {
    try {
      let res = await api.get(`${process.env.API_URL}/request-token`);
      if (res.status == 429){
        setMessage("Já foi enviado um link pelo tempo determinado.")
        setError(true)
        return 0;
      }
    } catch {
      setMessage(
        "Erro ao enviar o link de login. Por favor, tente mais tarde."
      );
    }
    setMessage("Se existir uma conta, um link foi enviado para seu e-mail.");
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
    setCooldown(3600);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login por e-mail</h2>
      <button
        onClick={handleSendLink}
        disabled={cooldown > 0 || error}
        className={`w-full py-2 rounded text-white font-medium transition-colors duration-200 ${
          cooldown > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {cooldown > 0
          ? `Aguarde ${Math.floor(cooldown / 60)}:${(cooldown % 60)
              .toString()
              .padStart(2, "0")}`
          : "Enviar link de login"}
      </button>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default page;
