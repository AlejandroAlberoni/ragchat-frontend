"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { roboto, roboto_condensed } from "@/lib/fonts";
import { Curriculum } from "@/lib/schemas";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import CurriculumCard from "./curriculumcard";
import Upload from "./upload";

const Page = () => {
  const myCVS = (url: string) => api.get(url).then((res) => res.data.data);
  const { data: cvs, mutate }: { data: Curriculum[]; mutate: () => void } =
    useSWR(`${process.env.NEXT_PUBLIC_API_URL}/admin/my-curriculums`, myCVS);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete/${id}`);
      toast(`O curriculo ${id} foi deletado.`);
      mutate();
    } catch (error) {
      console.error("Erro ao excluir currículo:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-center my-10">
        <Upload />
      </div>
      {Array.isArray(cvs) && cvs.length > 0 ? (
        <div className="md:mx-80 md:gap-6 gap-10 grid md:grid-cols-3">
          {cvs.map((value: Curriculum) => (
            <div
              key={value._id}
              className="relative p-4 bg-zinc-300 rounded-xl flex flex-col"
            >
              {value?.active && (
                <div className="absolute top-2 right-2 border-2 px-[3px] rounded-sm border-emerald-300 text-emerald-500">
                  Ativo
                </div>
              )}
              <b
                className={`${roboto_condensed.className} font-light text-center my-2`}
              >
                {value.name || "Nome indefinido"}
              </b>
              <CurriculumCard value={value} />
              <p
                className={`${roboto_condensed.className} font-semibold italic text-sm my-2 text-zinc-700`}
              >
                Upload: {new Date(value.created_at).toDateString()}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="absolute bottom-2 right-4">
                    <Trash2 />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(value._id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      ) : (
        <h2 className={`${roboto.className} text-center text-zinc-700 text-xl`}>
          Não há documentos disponíveis.
        </h2>
      )}
    </div>
  );
};

export default Page;
