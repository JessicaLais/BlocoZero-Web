import { useState } from "react";
import { InputForm } from "./InputForm";
import { TextareaAuth } from "./TextareaAuth"; 
import { Button } from "../../home/components/Button";
import { AbasCadastroObra } from "./AbasCadastroObra";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { api } from "../../../services/api";
import { id } from "zod/v4/locales";

const workSchema = z.object({
  title: z.string().min(1, "O nome da obra é obrigatório"),
  id_entreprise: z.coerce.number().int("O ID da empresa é inválido"),
  id_manager: z.coerce.number().int("O ID do gerente é inválido"),
  cnpj: z.string().length(14, "O CNPJ deve ter exatamente 14 dígitos"),
  address: z.string().min(1, "O endereço é obrigatório"),
  cep: z.string().length(8, "O CEP deve ter exatamente 8 dígitos"),
  budget: z.coerce.number().positive("O orçamento deve ser um valor positivo"),
  start_time: z.coerce.date({ error: "A data de início é inválida" }),
  end_time: z.coerce.date({ error: "A data de término é inválida" }),
  description: z.string().min(1, "A descrição é obrigatória"),
  photo: z.instanceof(File)
      .nullable()
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, `A imagem deve ter no máximo 5MB.`)
      .refine((file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Formato de imagem inválido (JPEG, PNG ou WebP)."),
  tender_id: z.coerce.number().int("O ID da empresa é inválido"),
});

export function FormCadastroObra() {
    const [formData, setFormData] = useState({
        title: "",
        id_entreprise: "1", 
        id_manager: "1",
        tender_id: "2",
        cnpj: "",
        address: "",
        cep: "",
        budget: "",
        start_time: "",
        end_time: "",
        description: "",
        photo: null as File | null,
        encarregado: "", 
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                photo: file // Guarda o objeto File no estado
            }));
        }
    };

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log("Dados do formulário antes de validar:", formData);

        // 1. CRIE O FORMDATA
        const dataToSend = new FormData();

        try {
            setIsLoading(true);
          
            const parsedData = workSchema.parse(formData);

            console.log("Dados validados:", parsedData);

           
            dataToSend.append('title', parsedData.title);
            dataToSend.append('id_entreprise', String(parsedData.id_entreprise));
            dataToSend.append('id_manager', String(parsedData.id_manager));
            dataToSend.append('cnpj', parsedData.cnpj);
            dataToSend.append('address', parsedData.address);
            dataToSend.append('cep', parsedData.cep);
            dataToSend.append('budget', String(parsedData.budget));
            dataToSend.append('start_time', parsedData.start_time.toISOString());
            dataToSend.append('end_time', parsedData.end_time.toISOString());
            dataToSend.append('description', parsedData.description);
            dataToSend.append('tender_id', String(parsedData.tender_id));
            
            if (parsedData.photo) {
                dataToSend.append('photo', parsedData.photo);
            }

            await api.post("/work/register", dataToSend);
            alert("Obra cadastrada com sucesso!");

        } catch (error) {
            console.error("Erro ao cadastrar obra:", error); 
            if (error instanceof ZodError) {
                return alert(error.issues[0].message);
            }
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || "Erro no servidor. Tente novamente.";
                return alert(message);
            }
            alert("Ocorreu um erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <form onSubmit={onSubmit} className="w-full space-y-4 py-5 px-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-row px-4 items-center gap-6">
                <InputForm legend="Nome da obra:" name="title" value={formData.title} onChange={handleChange} containerClassName="flex-1" />
                <InputForm legend="CNPJ:" name="cnpj" value={formData.cnpj} onChange={handleChange} containerClassName="flex-1" />
                <InputForm legend="Encarregado:" name="encarregado" value={formData.encarregado} onChange={handleChange} containerClassName="flex-1" />
            </div>
            <div className="flex flex-row px-4 items-center gap-6">
                <InputForm legend="Endereço:" name="address" value={formData.address} onChange={handleChange} containerClassName="w-1/2" />
                <InputForm legend="CEP:" name="cep" value={formData.cep} onChange={handleChange} containerClassName="w-1/4" />
                <InputForm legend="Valor do contrato:" name="budget" type="number" value={formData.budget} onChange={handleChange} containerClassName="flex-1" />
            </div>
            <div className="flex flex-row px-4 items-center gap-6">
                <InputForm legend="Data de início:" name="start_time" type="date" value={formData.start_time} onChange={handleChange} containerClassName="w-1/3" />
                <InputForm legend="Previsão de término:" name="end_time" type="date" value={formData.end_time} onChange={handleChange} containerClassName="w-1/3" />
                <InputForm 
                    legend="Foto da obra:" 
                    name="photo"         
                    type="file"         
                    onChange={handleFileChange} 
                    containerClassName="flex-1" 
                />
            </div>
            <div className="px-4 flex justify-between items-end gap-6">
                <TextareaAuth legend="Descrição:" name="description" value={formData.description} onChange={handleChange} />
                <Button variant="base" className="px-8 py-2 h-8 bg-gray-350 text-gray-950 hover:bg-gray-300 font-semibold rounded-sm" isLoading={isLoading} type="submit">
                    Registrar
                </Button>

            </div>
            <div className="flex flex-row items-center">
                <AbasCadastroObra />
            </div>
        </form>
    );
}