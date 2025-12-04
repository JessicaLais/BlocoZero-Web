import { useEffect, useState } from "react";
import { api } from "../../../../services/api";
import searchIcon from "../../../../assets/search-icon.svg"; 

interface BudgetData {
    id_budget: number;
    code: string;
    name: string;
    unitMeasure: string;
    weightLength: number | null;
    id_type: number;
    id_category: number;
    id_stage: number;
}

interface GenericOption { id: number; name: string; }

export function TabBudget() {
    const CURRENT_WORK_ID = 1;

    const [budgets, setBudgets] = useState<BudgetData[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState("");

    const [types, setTypes] = useState<GenericOption[]>([]);
    const [categories, setCategories] = useState<GenericOption[]>([]);
    const [stages, setStages] = useState<GenericOption[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [resBudgets, resTypes, resCats, resStages] = await Promise.all([
                    api.get(`/budget/list/${CURRENT_WORK_ID}`),
                    api.get(`/type/list/${CURRENT_WORK_ID}`).catch(() => ({ data: { types: [] } })),
                    api.get(`/category/list/1`).catch(() => ({ data: { categories: [] } })),
                    api.get(`/stage/list/${CURRENT_WORK_ID}`).catch(() => ({ data: { stages: [] } }))
                ]);

                const budgetData = resBudgets.data;
                if (budgetData && budgetData.budgets) {
                    setBudgets(budgetData.budgets);
                } else if (Array.isArray(budgetData)) {
                    setBudgets(budgetData);
                } else {
                    setBudgets([]);
                }

                const typeList = resTypes.data.types || resTypes.data || [];
                setTypes(typeList.map((t: any) => ({ id: t.id_type || t.id, name: t.name })));

                const catList = resCats.data.categories || [];
                setCategories(catList.map((c: any) => ({ id: c.id_category || c.id, name: c.name })));

                const stageList = resStages.data.stages || resStages.data || [];
                setStages(stageList.map((s: any) => ({ id: s.id_stage || s.id, name: s.name })));

            } catch (error) {
                console.error("Erro ao carregar dados do orçamento:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getTypeName = (id: number) => types.find(t => t.id === id)?.name || '-';
    const getCatName = (id: number) => categories.find(c => c.id === id)?.name || '-';
    const getStageName = (id: number) => stages.find(s => s.id === id)?.name || '-';

    const filteredBudgets = budgets.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <main className="p-5">
                <p>Carregando dados do orçamento...</p>
            </main>
        );
    }

    return (
        <main className="p-5">
            
            <div className="flex justify-center mb-4">
                <div className="relative w-64">
                    <input 
                        type="text" 
                        placeholder="Pesquisar..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-4 py-1 rounded-full border border-gray-400 text-sm focus:outline-none focus:border-gray-600 bg-gray-50 "
                    />
                    <img 
                        src={searchIcon} 
                        alt="Buscar" 
                        className="absolute left-2.5 top-1.5 w-4 h-4 opacity-50" 
                    />
                </div>
            </div>

            <div className="w-full flex gap-10 overflow-y-scroll max-h-[310px] border-1 border-gray-400 bg-white rounded-lg">
                <table className="bg-white shadow-lg w-full text-left">
                    <thead>
                        <tr className="bg-white border-b border-gray-200">
                            <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Código</th>
                            <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Nome</th>
                            <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Tipo</th>
                            <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Categoria</th>
                            <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Etapa Destinada</th>
                            <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700 text-center">Unidade</th>
                            <th className="px-2 py-2 font-semibold text-gray-700 text-center">Massa/Comp</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {filteredBudgets.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center p-4 text-gray-500">Nenhum item encontrado.</td>
                            </tr>
                        ) : (
                            filteredBudgets.map((item) => (
                                <tr key={item.id_budget} className="border-b border-gray-200 hover:bg-gray-50"> 
                                    <td className="px-2 py-1 border-r border-gray-200">{item.code}</td>
                                    <td className="px-2 py-1 border-r border-gray-200">{item.name}</td>
                                    <td className="px-2 py-1 border-r border-gray-200">{getTypeName(item.id_type)}</td>
                                    <td className="px-2 py-1 border-r border-gray-200">{getCatName(item.id_category)}</td>
                                    <td className="px-2 py-1 border-r border-gray-200">{getStageName(item.id_stage)}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 text-center">{item.unitMeasure}</td>
                                    <td className="px-2 py-1 text-center">
                                        {item.weightLength ? item.weightLength : '----'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}