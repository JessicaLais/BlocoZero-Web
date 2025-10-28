import { useState } from "react";
import { InputForm } from "../InputForm";
import { SelectForm } from "../SelectForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg"
import incluirSvg from "../../../../assets/incluir.svg"
import deletarSvg from "../../../../assets/deletar.svg"
export function MateriaisPanel() {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="overflow-y-scroll h-[160px]" >
            
             {isVisible &&
            <form className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row items-center gap-6">
                            <SelectForm legend="Código:" containerClassName="flex-1">
                                <option value="">Selecione...</option>
                                <option value="ME-CL-001">ME-CL-001</option>
                            </SelectForm>
                            <SelectForm legend="Categoria:" containerClassName="flex-1">
                                <option value="">Selecione...</option>
                                <option value="estrutura">Material de estrutura</option>
                            </SelectForm>
                            <SelectForm legend="Associação:" containerClassName="flex-1">
                                <option value="">Selecione...</option>
                                <option value="fundacao">Infraestrutura (Fundação)</option>
                            </SelectForm>
                        </div>
                        <div className="flex flex-row items-center gap-6">
                            <InputForm legend="Nome do material:" containerClassName="flex-1" />
                            <SelectForm legend="Unidade de medida:" containerClassName="flex-1">
                                <option value="">Selecione...</option>
                                <option value="kg">kg</option>
                                <option value="L">L</option>
                                <option value="m">m</option>
                            </SelectForm>
                            <InputForm legend="Massa/Comprimento(un):" containerClassName="flex-1" />
                        </div>
                        <div className="flex flex-row items-center gap-10">
                             <InputForm legend="Quantidade em estoque:" containerClassName="w-1/3"/>
                             <InputForm legend="Preço unitário:" containerClassName="w-1/3" />
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
                    <th className="px-1 border-1">Código</th>
                    <th className="px-1 border-1">Material</th>
                    <th className="px-1 border-1">Categoria</th>
                    <th className="px-1 border-1">Etapa Destinada</th>
                    <th className="px-1 border-1">Un medida</th>
                    <th className="px-1 border-1">Massa/Comprimento</th>
                    <th className="px-1 border-1">Preço unitário</th>
                    <th className="px-1 border-1">Qtd estoque</th>
                </tr>
            </thead>
            <tbody>
                
                    <tr className="text-sm border-b-1 border-gray-500 "> 
                        <td className="px-2 border-1">Teste</td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                    </tr>   
             
            </tbody>

            </table>
            
        </div>
    );
}