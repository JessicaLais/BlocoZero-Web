import { CardOrçamento } from "../features/gestor/componentes/orçamento/CardOrçamento"
import { TabBudget } from "../features/gestor/componentes/orçamento/TabBudget";
import { FaDollarSign } from "react-icons/fa";
export function Orçamento(){
    return(
        <div className="flex-col h-full overflow-hidden bg-white">
            <div className="w-full p-5 flex gap-10 overflow-hidden ">
                <CardOrçamento
                title="Valor do contrato"
                value="R$ 150.000,00"
                icon={FaDollarSign}
                />
                <CardOrçamento 
                title="Total gasto"
                value="R$ 150.000,00"
                icon={FaDollarSign}
                />
            </div>
            <TabBudget/>
        </div>
    )
}