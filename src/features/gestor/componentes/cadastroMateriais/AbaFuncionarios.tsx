import { useEffect, useState } from "react";
import { InputForm } from "../InputForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg"
import incluirSvg from "../../../../assets/incluir.svg"
import deletarSvg from "../../../../assets/deletar.svg"

interface FuncionarioData {
  id: number;
  user: {
    id: number;
    name: string;
    userFunction: string;
    hourlyRate: number;
  };
}

export function FuncionariosPanel(){
    const [isVisible, setIsVisible] = useState(false);
    const [funcionarios, setFuncionarios] = useState<FuncionarioData[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getFuncionarios = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/listTenders/0`);
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
            <form className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row items-center gap-6">
                            <InputForm legend="Código de identificação:" containerClassName="w-1/3" />
                            <InputForm legend="Função:" containerClassName="w-1/2" />
                        </div>
                        <div className="flex flex-row items-center gap-10">
                             <InputForm legend="Nome do funcionário:" containerClassName="w-1/3"/>
                             <InputForm legend="Ganho/h:" containerClassName="w-1/3" />
                        </div>
                </form>}
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
                        <tr key={func.id} className="text-sm border-b-1 border-gray-500">
                            <td className="px-2 border-1">{func.user.id}</td> 
                            <td className="px-2 border-1">{func.user.name}</td>
                            <td className="px-2 border-1">
                                {func.user.hourlyRate.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-2 border-1">{func.user.userFunction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    )
}