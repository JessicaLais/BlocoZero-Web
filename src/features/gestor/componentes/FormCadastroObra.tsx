import { useState } from "react";
import { InputForm } from "./InputForm";
import { TextareaAuth } from "./TextareaAuth"; 
import { Button } from "../../home/components/Button";
import { AbasCadastroObra } from "./AbasCadastroObra";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { api } from "../../../services/api";

const workSchema = z.object({
  title: z.string().min(1, "O nome da obra é obrigatório"),
  id_enterprise: z.coerce.number().int("O ID da empresa é inválido"),
  cnpj: z.string().length(14, "O CNPJ deve ter exatamente 14 dígitos"),
  address: z.string().min(1, "O endereço é obrigatório"),
  cep: z.string().length(8, "O CEP deve ter exatamente 8 dígitos"),
  budget: z.coerce.number().positive("O orçamento deve ser um valor positivo"),
  start_time: z.coerce.date({ error: "A data de início é inválida" }),
  end_time: z.coerce.date({ error: "A data de término é inválida" }),
  description: z.string().min(1, "A descrição é obrigatória"),
  photo_url: z.string().url("URL da foto inválida").optional().or(z.literal('')),
  tender_id: z.coerce.number().int("O ID da empresa é inválido"),
});

export function FormCadastroObra() {
    const [formData, setFormData] = useState({
        title: "",
        id_enterprise: "0", 
        tender_id: "8",
        cnpj: "",
        address: "",
        cep: "",
        budget: "",
        start_time: "",
        end_time: "",
        description: "",
        photo_url: "",
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

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log("Dados do formulário antes de validar:", formData);
        try {
            setIsLoading(true);
            const parsedData = workSchema.parse(formData);

            console.log("Dados validados e prontos para enviar:", parsedData);

            await api.post("/work/register", parsedData);
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
                <InputForm legend="Foto da obra:" name="photo_url" value={formData.photo_url} onChange={handleChange} containerClassName="flex-1" />
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