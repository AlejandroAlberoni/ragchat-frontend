import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={"p-[1rem] bg-[#222] text-white flex justify-between"}>
        <h1>Área Administrativa</h1>
        <a href="/chat" className="group">
          Chat
          <ArrowBigRight className="inline-block group-hover:translate-x-2 transition-all"></ArrowBigRight>
        </a>
      </header>
      <main style={{ padding: "2rem" }}>{children}</main>
    </>
  );
}
