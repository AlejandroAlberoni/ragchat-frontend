"use client";
import api from "@/lib/api";
import { Curriculum } from "@/lib/schemas";
import { CirclePlus } from "lucide-react";
import useSWR from "swr";
import CurriculumCard from "./curriculumcard";
import { useEffect } from "react";
import Upload from "./upload";
import { roboto, roboto_condensed } from "@/lib/fonts";

const Page = () => {
  const myCVS = (url: string) => api.get(url).then((res) => res.data.data);
  const {
    data: cvs,
    isLoading: isLoadingCVS,
  }: { data: Curriculum[]; isLoading: boolean } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/my-curriculums`,
    myCVS
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-center my-10">
        <Upload />
      </div>
      {cvs?.length != 0 ? (
        <div className="md:mx-80 md:gap-6 gap-10 grid md:grid-cols-3">
          {
          cvs &&
             cvs.map((value: Curriculum) => (
                <div
                  key={value._id}
                  className="relative p-4 bg-zinc-300 rounded-xl flex flex-col"
                >
                  {value?.active && (
                    <div className="absolute top-2 right-2 border-2 px-[3px] rounded-sm border-emerald-300 text-emerald-500">
                      Ativo
                    </div>
                  )}
                  <b className={`${roboto_condensed.className} font-light text-center my-2`}>
                    {value.name || "Nome indefinido"}
                  </b>
                  {!value.text ? (
                    <div>
                      <CirclePlus className="h-5 w-5 text-zinc-400" />
                      <p className="font-sans">Adicionar pdf</p>
                    </div>
                  ) : (
                    <CurriculumCard value={value} />
                  )}
                  <p className={`${roboto_condensed.className} font-semibold italic text-sm my-2 text-zinc-700`}>
                    Upload: {new Date(value.created_at).toDateString()}
                  </p>
                </div>
              ))
            }
        </div>
      ): <h2 className={`${roboto.className} text-center text-zinc-700 text-xl`}>Não há documentos disponíveis.</h2>}
    </div>
  );
};

export default Page;
