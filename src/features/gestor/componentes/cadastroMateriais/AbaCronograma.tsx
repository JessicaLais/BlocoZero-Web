import { useState } from "react";
import { InputForm } from "../InputForm";
import { SelectForm } from "../SelectForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg"
import incluirSvg from "../../../../assets/incluir.svg"
import deletarSvg from "../../../../assets/deletar.svg"
export function CronogramaPanel(){
    const [isVisible, setIsVisible] = useState(false);
    return(
        <div className="overflow-y-scroll h-[160px]">
            {isVisible &&
            <form className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row items-center gap-6">
                            <InputForm legend="Subetapa:" containerClassName="w-1/3" />
                            <SelectForm legend="Etapa" containerClassName="w-1/3">
                                <option value="">Selecione</option>
                                <option value="">Teste</option>
                            </SelectForm>
                        </div>
                        <div className="flex flex-row items-center gap-10">
                             <InputForm legend="Previsão de início:" type="date"/>
                             <InputForm legend="Previsão do fim:"  type="date"/>
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
                    <th className="px-1 border-1">Etapa</th>
                    <th className="px-1 border-1">Subetapa</th>
                    <th className="px-1 border-1">Inicio</th>
                    <th className="px-1 border-1">Fim</th>
                </tr>
            </thead>
            <tbody>
                
                    <tr className="text-sm border-b-1 border-gray-500 "> 
                        <td className="px-2 border-1">Teste</td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        
                    </tr>   
             
            </tbody>
            <tbody>
                
                    <tr className="text-sm border-b-1 border-gray-500 "> 
                        <td className="px-2 border-1">Teste</td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        
                    </tr>   
             
            </tbody>
            <tbody>
                
                    <tr className="text-sm border-b-1 border-gray-500 "> 
                        <td className="px-2 border-1">Teste</td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        
                    </tr>   
             
            </tbody>
            <tbody>
                
                    <tr className="text-sm border-b-1 border-gray-500 "> 
                        <td className="px-2 border-1">Teste</td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        <td className="px-2 border-1"></td>
                        
                    </tr>   
             
            </tbody>
            
          
            </table>
            
        </div>
    )
}