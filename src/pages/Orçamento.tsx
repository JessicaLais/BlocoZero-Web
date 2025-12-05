import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CardOrçamento } from "../features/gestor/componentes/orçamento/CardOrçamento"; 
import { TabBudget } from "../features/gestor/componentes/orçamento/TabBudget"; 
import { api } from "../services/api";
import { Button } from "../features/home/components/Button";

export function Orçamento() {
    const navigate = useNavigate();
    const { work_id } = useParams<{ work_id: string }>(); // 2. Pega ID da URL
    
    // Converte para número. Se não tiver ID, é 0 (mas a rota deve impedir isso)
    const currentWorkId = Number(work_id);

    const [contractValue, setContractValue] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [workTitle, setWorkTitle] = useState("");

    useEffect(() => {
        if (!currentWorkId) return;

        const fetchContractValue = async () => {
            try {
                // Busca dados da obra específica
                const resWork = await api.get(`/work/specific/${currentWorkId}`);
                const workData = resWork.data.work || resWork.data;
                
                if (workData) {
                    const val = workData.budget; 
                    setContractValue(Number(val || 0));
                    setWorkTitle(workData.title || "Obra");
                }
            } catch (error) {
                console.warn("Erro ao buscar dados da obra.", error);
            }
        };

        const fetchTotalSpent = async () => {
            try {
                // Busca o orçamento da obra específica
                const resBudget = await api.get(`/budget/list/${currentWorkId}`);
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
    }, [currentWorkId]); // 3. Recarrega se o ID mudar

    const formatMoney = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (!currentWorkId) return <div className="p-4">Obra não encontrada.</div>;

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            
            {/* Cabeçalho Opcional para Navegação */}
            <div className="px-5 pt-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Orçamento: {workTitle}</h1>
                <Button 
                    onClick={() => navigate('/orcamento')} // Volta para a seleção
                    className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs rounded"
                >
                    Trocar Obra
                </Button>
            </div>

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

            <div className="flex-1 overflow-hidden px-5 pb-5">
                {/* 4. IMPORTANTE: Passamos o ID para a tabela de orçamento */}
                <TabBudget workId={currentWorkId} />
            </div>
        </div>
    );
}