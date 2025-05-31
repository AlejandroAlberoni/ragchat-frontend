import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Curriculum, EditDto } from "@/lib/schemas";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";


const activateCV = async (id: string) => {
  const data = await api.put(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/activate-cv/${id}`
  );
  return data;
};

const saveEditCV = async (editDto: EditDto) => {
  const data = api.post(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/edit`,
    editDto
  );
  return data;
};

const CurriculumCard = function ({ value }: { value: Curriculum }) {
  const [edit, setEdit] = useState<EditDto>({
    parentId: value._id,
    name: value.name || "",
    text: value.text || "",
    processed: value.processed || "",
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isNameChanged = edit.name !== (value.name || "");
  const isTextChanged = edit.text !== (value.text || "");


  const handleActivateCV = async () => {
    try {
      const response = await activateCV(value._id);
      toast(`O curriculo ${value._id} foi ativado.`);
      mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/my-curriculums`,
        (docs: Curriculum[] = []) =>
          docs.map((doc) =>
            doc._id === response.data.data._id
              ? response.data.data
              : { ...doc, active: false }
          ),
        false
      );
    } catch (err) {
      toast(`Erro ao ativar o curriculo ${err}`);
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const response = await saveEditCV(edit);
      toast(`O curriculo ${value._id} foi salvo com sucesso.`);
      mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/my-curriculums`,
        (docs: Curriculum[] = []) =>
          docs.map((doc) =>
            doc._id === response.data.data._id ? response.data.data : doc
          ),
        false
      );
    } catch (err) {
      toast(`Erro ao salvar. Erro: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Ver mais</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="Edição de componentes de currículo">
        <DialogHeader>
          <DialogClose asChild>
            <Button
              className="my-2 bg-emerald-500 hover:bg-emerald-600"
              onClick={handleActivateCV}
            >
              Usar este currículo
            </Button>
          </DialogClose>
          <DialogTitle className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={edit.name || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEdit((prevEdit) => ({ ...prevEdit, name: newValue }));
              }}
              className={`${isNameChanged ? "border-emerald-300" : ""}`}
            />
            <span className="italic text-sm text-stone-400 font-extralight">
              {new Date(value.created_at).toUTCString()}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            value={edit.text || ""}
            placeholder="Edite ou crie seu currículo aqui."
            onChange={(e) => {
              const newValue = e.target.value;
              setEdit((prevEdit) => ({ ...prevEdit, text: newValue }));
            }}
            className={`h-40 ${isTextChanged ? "border-emerald-300" : ""}`}
            disabled={loadingAI}
          />
        </div>

        <div>
          <Label htmlFor="text"></Label>
          <Textarea
            id="processed"
            value={edit.processed || ""}
            title="Texto gerado com IA."
            disabled={true}
            readOnly
          />
        </div>
        <DialogFooter>
          <DialogClose>Cancelar</DialogClose>
          <Button
            className="flex"
            variant={"ghost"}
            disabled={(!isNameChanged && !isTextChanged) || isSaving}
            onClick={handleSaveEdit}
          >
            {isSaving ? (
              <>
                Salvando...
                <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CurriculumCard;
