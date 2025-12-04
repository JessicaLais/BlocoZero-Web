import { useEffect, useState } from "react";
import { CardOrçamento } from "../features/gestor/componentes/orçamento/CardOrçamento"; 
import { TabBudget } from "../features/gestor/componentes/orçamento/TabBudget"; 
import { api } from "../services/api";

export function Orçamento() {
    const CURRENT_WORK_ID = 1;

    
    const [contractValue, setContractValue] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
    
        const fetchContractValue = async () => {
            try {
                
                const resWork = await api.get(`/work/specific/${CURRENT_WORK_ID}`);
                
                
                const workData = resWork.data.work || resWork.data;
                
                if (workData) {
                    const val = workData.budget; 
                    setContractValue(Number(val || 0));
                }
            } catch (error) {
                console.warn("Erro ao buscar dados da obra.", error);
            }
        };

        
        const fetchTotalSpent = async () => {
            try {
                const resBudget = await api.get(`/budget/list/${CURRENT_WORK_ID}`);
                const data = resBudget.data;
                
                let lista = [];
                if (data && data.budgets) lista = data.budgets;
                else if (Array.isArray(data)) lista = data;

                
                const totalCalculado = lista.reduce((acc: number, item: any) => {
                    return acc + Number(item.total || 0);
                }, 0);

                setTotalSpent(totalCalculado);
            } catch (error) {
                console.error("Erro ao calcular total gasto:", error);
            }
        };

        fetchContractValue();
        fetchTotalSpent();
    }, []);

    
    const formatMoney = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
           
            <div className="w-full p-5 flex gap-6">
                <CardOrçamento
                    title="Valor do contrato"
                    value={formatMoney(contractValue)}
                />
                <CardOrçamento 
                    title="Total gasto"
                    value={formatMoney(totalSpent)}
                />
            </div>

            <div className="flex-1 overflow-hidden">
                <TabBudget />
            </div>
        </div>
    );
}