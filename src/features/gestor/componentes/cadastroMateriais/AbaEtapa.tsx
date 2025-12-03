import { useEffect, useState } from "react";
import { z } from "zod";
import { InputForm } from "../InputForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg";
import incluirSvg from "../../../../assets/incluir.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface StageData {
    id_stage: number;
    name: string;
    expStartDate: string;
    expEndDate: string;
    progress: number;
}

const stageSchema = z.object({
    name: z.string().min(3, "Nome obrigatório"),
    expStartDate: z.string().min(1, "Data Início obrigatória"),
    expEndDate: z.string().min(1, "Data Fim obrigatória"),
});

interface CronogramaPanelProps {
    onSelectStage: (id: number, name: string) => void;
}

export function CronogramaPanel({ onSelectStage }: CronogramaPanelProps) {
    const CURRENT_WORK_ID = 1; 

    const [isVisible, setIsVisible] = useState(false);
    const [stages, setStages] = useState<StageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        expStartDate: "",
        expEndDate: "",
    });

    const resetForm = () => {
        setFormData({ name: "", expStartDate: "", expEndDate: "" });
    };

    const fetchStages = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/stage/list/${CURRENT_WORK_ID}`);
            console.log(response.data);
            if (response.data && response.data.stages) {
                setStages(response.data.stages);
            } else {
                setStages([]);
            }
        } catch (error) {
            console.warn("Erro ao buscar etapas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStages();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewClick = () => {
        resetForm();
        setSelectedId(null);
        setIsVisible(true);
    };

    const handleEditClick = () => {
        if (!selectedId) return alert("Selecione uma etapa.");
        const item = stages.find(s => s.id_stage === selectedId);
        if (item) {
            setFormData({
                name: item.name,
                expStartDate: item.expStartDate ? item.expStartDate.split('T')[0] : '',
                expEndDate: item.expEndDate ? item.expEndDate.split('T')[0] : '',
            });
            setIsVisible(true);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedId) return alert("Selecione uma etapa.");
        if (!window.confirm("Ao excluir a etapa, todas as subetapas serão apagadas. Confirmar?")) return;
        try {
            await api.delete(`/stage/delete/${selectedId}`);
            alert("Etapa excluída!");
            setSelectedId(null);
            setIsVisible(false);
            fetchStages();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = stageSchema.parse(formData);
            const payload = { ...data, id_work: CURRENT_WORK_ID, progress: 0, exeStartDate: "", exeEndDate: "" };

            if (selectedId) {
                await api.put(`/stage/update/${selectedId}`, payload);
                alert("Etapa atualizada!");
            } else {
                await api.post("/stage/register", payload);
                alert("Etapa criada!");
            }
            setIsVisible(false);
            resetForm();
            setSelectedId(null);
            fetchStages();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar.");
        }
    };

    return (
        <div className="overflow-y-scroll h-[250px]">
            {isVisible && (
                <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
                    <div className="flex gap-4">
                        <InputForm legend="Nome da Etapa:" name="name" value={formData.name} onChange={handleInputChange} containerClassName="flex-1" />
                        <InputForm legend="Início:" type="date" name="expStartDate" value={formData.expStartDate} onChange={handleInputChange} containerClassName="w-1/4" />
                        <InputForm legend="Fim:" type="date" name="expEndDate" value={formData.expEndDate} onChange={handleInputChange} containerClassName="w-1/4" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button onClick={handleSubmit} className="px-4 py-1 text-sm bg-gray-350 hover:bg-gray-300 border border-gray-400">Salvar</Button>
                        <Button onClick={() => setIsVisible(false)} className="px-4 py-1 text-sm bg-red-200 hover:bg-red-300 border border-red-400">Cancelar</Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-2 gap-2">
                <Button onClick={handleNewClick} className="flex gap-2 px-3 py-1 text-sm bg-gray-350 border border-gray-400 hover:bg-gray-300">
                    <img src={incluirSvg} className="w-4 h-4" /> Incluir
                </Button>
                <Button onClick={handleEditClick} className={`flex gap-2 px-3 py-1 text-sm border border-gray-400 ${selectedId ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-350 opacity-50'}`}>
                    <img src={editarSvg} className="w-4 h-4" /> Editar
                </Button>
                <Button onClick={handleDeleteClick} className={`flex gap-2 px-3 py-1 text-sm border border-gray-400 ${selectedId ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-350 opacity-50'}`}>
                    <img src={deletarSvg} className="w-4 h-4" /> Excluir
                </Button>
            </div>

            <table className="bg-white border border-gray-300 w-full text-left mt-2 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-2 py-1 border border-gray-300">Nome</th>
                        <th className="px-2 py-1 border border-gray-300">Início</th>
                        <th className="px-2 py-1 border border-gray-300">Fim</th>
                        <th className="px-2 py-1 border border-gray-300">Progresso</th>
                        <th className="px-2 py-1 border border-gray-300 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {stages.map(item => (
                        <tr 
                            key={item.id_stage} 
                            onClick={() => setSelectedId(selectedId === item.id_stage ? null : item.id_stage)}
                            className={`cursor-pointer hover:bg-blue-50 ${selectedId === item.id_stage ? 'bg-blue-200' : ''}`}
                        >
                            <td className="px-2 py-1 border border-gray-300">{item.name}</td>
                            <td className="px-2 py-1 border border-gray-300">{new Date(item.expStartDate).toLocaleDateString()}</td>
                            <td className="px-2 py-1 border border-gray-300">{new Date(item.expEndDate).toLocaleDateString()}</td>
                            <td className="px-2 py-1 border border-gray-300">{item.progress}%</td>
                            <td className="px-2 py-1 border border-gray-300 text-center">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        onSelectStage(item.id_stage, item.name);
                                    }}
                                    className="bg-blue-600 text-white px-3 py-0.5 rounded hover:bg-blue-700 text-xs font-bold"
                                >
                                    Ver Subetapas &gt;
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}