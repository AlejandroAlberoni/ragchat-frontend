import api from "@/lib/api";
import { Curriculum } from "@/lib/schemas";
import { FileUp, LoaderCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { mutate } from "swr";

const Upload = () => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length !== 1) {
        setError("Envie apenas um arquivo PDF.");
        return;
      }

      const file = acceptedFiles[0];

      if (file.type !== "application/pdf") {
        setError("O arquivo deve ser um PDF.");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data?.error) {
          setError(response.data.error);
        } else {
          setError(null);
          toast("Upload de documento foi um sucesso");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/my-curriculums`,
            (docs: Curriculum[] = []) => [response.data.data, ...docs],
            false
          );
        }
      } catch {
        setError(
            "Erro ao enviar o arquivo. Tente novamente."
        );
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });
  return (
    <div
      {...getRootProps()}
      className="w-max h-max border-4 border-dashed border-zinc-400 rounded-sm cursor-pointer transition-colors hover:border-blue-400"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center my-4 mx-2">
        <FileUp className="text-zinc-400 h-10 w-10 group" />
        <h3 className="text-xl text-center text-zinc-400 group">
          {isDragActive
            ? "Solte o arquivo PDF aqui..."
            : "Arraste ou clique para enviar um arquivo PDF"}
        </h3>
        {uploading && (
          <span className="mt-2 text-blue-500 text-lg">
            Enviando...
            <LoaderCircle className="animate-spin h-10 w-10 ml-2 inline-flex" />
          </span>
        )}
        {error && (
          <span className="my-2 mt-2 text-red-500 text-sm">{error}</span>
        )}
      </div>
    </div>
  );
};

export default Upload;
