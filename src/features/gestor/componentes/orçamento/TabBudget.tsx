import { useEffect, useState } from "react"
import { api } from "../../../../services/api";

interface ResourceData {
    id_budget: number;       
    code: string;
    name: string;
    unitMeasure: string;
    allocatedStage: string;
    weightLength: number | null; 
    type: {
        name: string;
    };
    category: {
        name: string;
    };
}

export function TabBudget() {
    const [budget, setBudget] = useState<ResourceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBudget = async () => {
            try {
                const response = await api.get("/budget/list");
                setBudget(response.data);
                console.log(response.data);

            } catch (error) {
                console.log("Erro ao buscar dados", error);
            } finally {
                setLoading(false);
            }
        }
        getBudget();
        
    }, []); 

    if (loading) {
        return (
            <main className="p-5">
                <p>Carregando dados do orçamento...</p>
            </main>
        );
    }

    return (
        <main className="p-5">
            <div className="w-full flex gap-10 overflow-hidden border-1 border-gray-400 bg-white rounded-lg">
                <table className="bg-white shadow-lg w-full text-left">
                    <thead>
                        <tr className="bg-white">
                            <th className="px-1 border-1 border-gray-200">Código</th>
                            <th className="px-1 border-1 border-gray-200">Nome</th>
                            <th className="px-1 border-1 border-gray-200">Tipo</th>
                            <th className="px-1 border-1 border-gray-200">Categoria</th>
                            <th className="px-1 border-1 border-gray-200">Etapa Destinada</th>
                            <th className="px-1 border-1 border-gray-200">Unidade</th>
                            <th className="px-1 border-1 border-gray-200">Massa/Comprimento</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {budget.map((item) => (
                            <tr key={item.id_budget}> 
                                <td className="px-1 border-1 border-gray-200">{item.code}</td>
                                <td className="px-1 border-1 border-gray-200">{item.name}</td>
                                <td className="px-1 border-1 border-gray-200">{item.type?.name || '----'}</td>
                                <td className="px-1 border-1 border-gray-200">{item.category?.name || '----'}</td>
                                <td className="px-1 border-1 border-gray-200">{item.allocatedStage}</td>
                                <td className="px-1 border-1 border-gray-200">{item.unitMeasure}</td>
                                <td className="px-1 border-1 border-gray-200">
                                    {item.weightLength || '----'} 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}