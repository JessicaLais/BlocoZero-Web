import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg"
import incluirSvg from "../../../../assets/incluir.svg"
import deletarSvg from "../../../../assets/deletar.svg"
import { api } from "../../../../services/api";

interface FuncionarioData {
  id_user: number; 
  enterprise_id: number;
  userFunction: string;
  name: string;
  email: string;
  hourlyRate: number; 
}
const funcSchema = z.object({
    enterprise_id: z.coerce.number().int("O ID da empresa é inválido"),
    name: z.string().min(1, "O nome do funcionário é obrigatório"),
    userFunction: z.string().min(1, "A função do funcionário é obrigatória"),
    email: z.string().email("O email é inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    phone: z.string().min(10, "O número de telefone é inválido"),
    works: z.string().min(1, "As obras atribuídas são obrigatórias"),
    hourlyRate: z.coerce.number().positive("O ganho por hora deve ser um valor positivo"),
})


export function FuncionariosPanel(){
    const [isVisible, setIsVisible] = useState(false);
    const [funcionarios, setFuncionarios] = useState<FuncionarioData[]>([]);
    const [loading, setLoading] = useState(true);
    const [formFuncData, setFormFuncData] = useState({
        enterprise_id: "1",
        name: "",
        userFunction: "",  
        email: "",
        password: "123456",
        phone: "",
        works: "",
        hourlyRate: "",
    });

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormFuncData(prevData => ({
        ...prevData,
        [name]: value

    }));
}
    async function handleFuncSubmit(event: React.FormEvent) {
        event.preventDefault();
        try{
            setLoading(true);
            const data = funcSchema.parse({
                name: formFuncData.name,
                enterprise_id: Number(formFuncData.enterprise_id),
                userFunction: formFuncData.userFunction,
                email: formFuncData.email,
                password: formFuncData.password,
                phone: formFuncData.phone,
                works: formFuncData.works,
                hourlyRate: Number(formFuncData.hourlyRate),
            });
            await api.post("/user/register", data)
            
            console.log("Dados validados com sucesso:", data);
        }catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                return alert(error.issues[0].message)
            }
            if(error instanceof AxiosError){
            return alert(error.response?.data.message)
        }

        alert("Não foi possível realizar a solicitação")

    }finally{
        setLoading(false)
    }
    }    

    useEffect(() => {
        const getFuncionarios = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/list/1`);
                const data = await response.json();
                console.log(data);
                setFuncionarios(data); 
            } catch (error) {
                console.error("Erro ao buscar dados:", error)
            } finally {
                setLoading(false);
            }
        };
        getFuncionarios()
    }, []); 

    if (loading) {
        return <p>Carregando dados...</p>
    }

    if (funcionarios.length === 0) {
        return <p>Nenhum funcionário encontrado.</p>
    }

    return(
        <div className="overflow-y-scroll h-[160px]">
            {isVisible &&
            <div onSubmit={handleFuncSubmit} className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md">
                    <div className="flex flex-row items-center gap-6">
                        <InputForm 
                            legend="Nome do funcionário:" 
                            value={formFuncData.name} 
                            onChange={handleInputChange} 
                            name="name"                  
                            required 
                            containerClassName="w-1/3" />
                        <InputForm 
                            legend="Email:" 
                            value={formFuncData.email} 
                            onChange={handleInputChange} 
                            name="email"                 
                            containerClassName="w-1/2" />
                        <InputForm 
                            legend="Função:" 
                            value={formFuncData.userFunction} 
                            onChange={handleInputChange} 
                            name="userFunction"          
                            containerClassName="w-1/3" />
                    </div>
                    <div className="flex flex-row items-center gap-10">
                        <InputForm 
                            legend="Número(Celular):" 
                            value={formFuncData.phone} 
                            onChange={handleInputChange} 
                            name="phone"                 
                            containerClassName="w-1/3"/>
                        <InputForm 
                            legend="Ganho/h:" 
                            value={formFuncData.hourlyRate} 
                            onChange={handleInputChange} 
                            name="hourlyRate"            
                            containerClassName="w-1/3" />
                        <InputForm 
                            legend="Atividades atribuídas:" 
                            value={formFuncData.works}
                            onChange={handleInputChange} 
                            name="works"                 
                            containerClassName="w-1/3" />
                    </div>
                        <Button className="gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400" isLoading={loading} onClick={handleFuncSubmit} type="button">Confirmar</Button>
                </div>}
            <div className="flex justify-end mt-4">
                <Button className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400" onClick={() => setIsVisible(!isVisible)}><img src={incluirSvg} />Incluir</Button>
                <Button className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"><img src={editarSvg} />Editar</Button>
                <Button className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"><img src={deletarSvg} />Excluir</Button>
            </div>
            <table className="bg-white border-1 border-gray-500 w-full text-left ">
            <thead> 
                <tr className="bg-gray-300">
                    <th className="px-1 border-1">Código de identificação</th>
                    <th className="px-1 border-1">Funcionário</th>
                    <th className="px-1 border-1">Ganho/h</th>
                    <th className="px-1 border-1">Função</th>
                </tr>
            </thead>
            <tbody>
                {funcionarios.map((func) => (
                    <tr key={func.id_user} className="text-sm border-b-1 border-gray-500">
                    <td className="px-2 border-1">{func.id_user}</td> 
                    <td className="px-2 border-1">{func.name}</td>
                    <td className="px-2 border-1">
                        {(func.hourlyRate || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-2 border-1">{func.userFunction}</td>
                    </tr>
                ))}
            </tbody>
            </table>
            
        </div>
    )
}