import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm";
import { SelectForm } from "../SelectForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg";
import incluirSvg from "../../../../assets/incluir.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface StockData {
    id_item?: number; 
    id_stock?: number; 
    id_work: number;
    id_type: number;
    id_category: number;
    code: string;
    name: string;
    unitMeasure: string;
    stockQuantity: number;
    weightLength: number;
    minQuantity: number;
    costUnit: number; 
    
    category?: { name: string };
}

const stockSchema = z.object({
    id_work: z.coerce.number().min(1, "ID da obra inválido"),
    id_type: z.coerce.number(),
    id_category: z.coerce.number().min(1, "Selecione a categoria"),
    code: z.string().min(1, "O código é obrigatório"),
    name: z.string().min(1, "O nome é obrigatório"),
    unitMeasure: z.string().min(1, "Selecione a unidade"),
    stockQuantity: z.coerce.number().min(0),
    weightLength: z.coerce.number().min(0),
    minQuantity: z.coerce.number().min(0),
    costUnit: z.coerce.number().min(0, "O custo deve ser maior ou igual a 0"),
});

export function MateriaisPanel() {
    
    const CURRENT_WORK_ID = 1; 

    const [isVisible, setIsVisible] = useState(false);
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        id_work: String(CURRENT_WORK_ID),
        id_type: "1",
        id_category: "",
        code: "",
        name: "",
        unitMeasure: "",
        stockQuantity: "",
        weightLength: "",
        minQuantity: "15",
        costUnit: "0.00",
    });

    const resetForm = () => {
        setFormData({
            id_work: String(CURRENT_WORK_ID),
            id_type: "1",
            id_category: "",
            code: "",
            name: "",
            unitMeasure: "",
            stockQuantity: "",
            weightLength: "",
            minQuantity: "15",
            costUnit: "0.00",
        });
    };

   
    const fetchStocks = async () => {
        try {
            const response = await api.get(`/stock/${CURRENT_WORK_ID}`);
            
            
            console.log("RESPOSTA REAL DO BACKEND:", JSON.stringify(response.data, null, 2));

            const data = response.data;

            
            if (data.error) {
                alert(`Erro vindo do Backend: ${data.error}`);
                setStocks([]);
                return;
            }

           
            if (Array.isArray(data)) {
                // Formato: [ ... ]
                setStocks(data);
            } else if (data.stock && Array.isArray(data.stock)) {
                
                setStocks(data.stock);
            } else if (data.stock_items && Array.isArray(data.stock_items)) {
                
                setStocks(data.stock_items);
            } else {
                console.error("Não encontrei uma lista válida no objeto:", data);
                setStocks([]);
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
            if (error instanceof AxiosError) {
                console.log("Detalhes do erro:", error.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewClick = () => {
        resetForm();
        setSelectedId(null);
        setIsVisible(true);
    };

    const handleEditClick = () => {
        if (!selectedId) return alert("Selecione um item para editar.");
        
        
        const item = stocks.find((s) => (s.id_stock === selectedId || s.id_item === selectedId));
        
        if (item) {
            setFormData({
                id_work: String(item.id_work),
                id_type: String(item.id_type),
                id_category: String(item.id_category),
                code: item.code,
                name: item.name,
                unitMeasure: item.unitMeasure,
                stockQuantity: String(item.stockQuantity),
                weightLength: String(item.weightLength),
                minQuantity: String(item.minQuantity),
                costUnit: String(item.costUnit || 0),
            });
            setIsVisible(true);
        }
    };

    
    const handleDeleteClick = async () => {
        if (!selectedId) return alert("Selecione um item para excluir.");
        
        
        if (!window.confirm("Tem certeza que deseja remover este item do estoque?")) return;

        try {
            setLoading(true);
            
            
            await api.delete(`/stock/delete/${selectedId}`); 
            
            alert("Item removido com sucesso!");
            
            
            setSelectedId(null);
            setIsVisible(false);
            resetForm();
            fetchStocks(); 

        } catch (error) {
            console.error("Erro ao excluir:", error);
            if (error instanceof AxiosError) {
                alert(error.response?.data?.error || "Erro ao excluir item.");
            } else {
                alert("Erro desconhecido ao excluir.");
            }
        } finally {
            setLoading(false);
        }
    };

   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            
           
            const data = stockSchema.parse(formData);

            if (selectedId) {
                
                await api.put(`/stock/update/${selectedId}`, data);
                alert("Item atualizado com sucesso!");
            } else {
                // --- MODO CRIAÇÃO (POST) ---
                await api.post("/stock/create", data);
                alert("Item criado com sucesso!");
            }

            // Fecha o formulário e atualiza a lista
            setIsVisible(false);
            resetForm();
            setSelectedId(null);
            fetchStocks();

        } catch (error) {
            console.log("Erro detalhado:", error);
            if (error instanceof ZodError) return alert(error.issues[0].message);
            if (error instanceof AxiosError) return alert(error.response?.data?.error || "Erro na API");
            alert("Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-y-scroll h-[200px]">
            {isVisible && (
                <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4">
                    <div className="flex flex-row items-center gap-6">
                        <InputForm 
                            legend="Código:" 
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            containerClassName="flex-1"
                        />

                        <SelectForm 
                            legend="Categoria:" 
                            name="id_category"
                            value={formData.id_category}
                            onChange={handleInputChange}
                            containerClassName="flex-1"
                        >
                            <option value="">Selecione...</option>
                            <option value="1">Estrutura (ID 1)</option>
                            <option value="2">Acabamento (ID 2)</option>
                        </SelectForm>
                        
                        
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <InputForm 
                            legend="Nome do material:" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            containerClassName="flex-1" 
                        />
                        <SelectForm 
                            legend="Unidade:" 
                            name="unitMeasure"
                            value={formData.unitMeasure}
                            onChange={handleInputChange}
                            containerClassName="w-24"
                        >
                            <option value="">...</option>
                            <option value="M³">M³</option>
                            <option value="kg">kg</option>
                            <option value="L">L</option>
                            <option value="m">m</option>
                            <option value="un">un</option>
                        </SelectForm>
                        <InputForm 
                            legend="Peso/Comp:" 
                            name="weightLength"
                            value={formData.weightLength}
                            onChange={handleInputChange}
                            type="number"
                            containerClassName="w-24" 
                        />
                         <InputForm 
                            legend="Custo Unit (R$):" 
                            name="costUnit"
                            value={formData.costUnit}
                            onChange={handleInputChange}
                            type="number"
                            step="0.01"
                            containerClassName="w-32" 
                        />
                    </div>

                    <div className="flex flex-row items-center gap-10">
                        <InputForm 
                            legend="Qtd Inicial:" 
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleInputChange}
                            type="number"
                            containerClassName="w-1/3"
                        />
                        <InputForm 
                            legend="Estoque Mínimo:" 
                            name="minQuantity"
                            value={formData.minQuantity}
                            onChange={handleInputChange}
                            type="number"
                            containerClassName="w-1/3"
                        />
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Button onClick={handleSubmit} className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400">
                            {selectedId ? "Salvar (Indisponível)" : "Confirmar Inclusão"}
                        </Button>
                        <Button onClick={() => setIsVisible(false)} className="px-4 h-[26px] text-sm bg-red-200 text-red-800 hover:bg-red-300 rounded-none border-1 border-gray-400">
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4 gap-2">
                <Button onClick={handleNewClick} className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400">
                    <img src={incluirSvg} alt="incluir" />Incluir
                </Button>
                <Button 
                    onClick={handleEditClick} 
                    className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-350 opacity-50'}`}
                >
                    <img src={editarSvg} alt="editar" />Editar
                </Button>
                <Button 
                    onClick={handleDeleteClick} 
                    className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-gray-350 opacity-50'}`}
                >
                    <img src={deletarSvg} alt="deletar" />Excluir
                </Button>
            </div>

            <table className="bg-white border-1 border-gray-500 w-full text-left mt-2">
                <thead> 
                    <tr className="bg-gray-300">
                        <th className="px-1 border-1">Código</th>
                        <th className="px-1 border-1">Nome</th>
                        <th className="px-1 border-1">Categoria</th>
                        <th className="px-1 border-1">Unidade</th>
                        <th className="px-1 border-1">Qtd Atual</th>
                        <th className="px-1 border-1">Minimo</th>
                        <th className="px-1 border-1">Custo Un.</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.length === 0 && !loading && (
                        <tr><td colSpan={7} className="text-center p-2">Nenhum item encontrado.</td></tr>
                    )}
                    {stocks.map((item) => {
                        // O ID pode vir como id_stock ou id_item, garantindo que pegamos um
                        const itemId = item.id_stock || item.id_item || 0;
                        return (
                            <tr 
                                key={itemId}
                                onClick={() => {
                                    if (selectedId === itemId) {
                                        setSelectedId(null);
                                        setIsVisible(false);
                                        resetForm();
                                    } else {
                                        setSelectedId(itemId);
                                        setIsVisible(false);
                                        resetForm();
                                    }
                                }}
                                className={`text-sm border-b-1 border-gray-500 cursor-pointer hover:bg-gray-200 ${selectedId === itemId ? 'bg-blue-200' : ''}`}
                            > 
                                <td className="px-2 border-1">{item.code}</td>
                                <td className="px-2 border-1">{item.name}</td>
                                <td className="px-2 border-1">{item.category?.name || item.id_category}</td>
                                <td className="px-2 border-1">{item.unitMeasure}</td>
                                <td className="px-2 border-1">{item.stockQuantity}</td>
                                <td className="px-2 border-1">{item.minQuantity}</td>
                                <td className="px-2 border-1">
                                    {item.costUnit ? `R$ ${Number(item.costUnit).toFixed(2)}` : '-'}
                                </td>
                            </tr> 
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}