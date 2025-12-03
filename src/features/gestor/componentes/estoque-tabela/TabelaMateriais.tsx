// components/TabelaMateriais.tsx

import { useEffect, useState } from "react";
// Certifique-se de que os ícones FiEdit e FiTrash2 estão importados
import { FiLoader, FiEdit, FiTrash2 } from "react-icons/fi"; 
import CrudMaterialModal from "./ModalMaterial"; 

interface Material {
    id_stock: number;
    codigo: string;
    nome: string;
    tipo: string;
    categoria: string;
    unidade: string;
    etapa: string;
    qtde: number;
    massa: number;
    comprimento: number;
    atual: number;
    minima: number;
    entrada_rec: number;
    entrada_acu: number;
    saida_rec: number;
    saida_acu: number;
    dt_ult_entrada: string;
    dt_ult_saida: string;
    id_budget: number;
}

interface TabelaMateriaisProps {
    endpoint: string;
    dadosIniciais: Material[];
}

export default function TabelaMateriais({ endpoint, dadosIniciais }: TabelaMateriaisProps) {
    const [materiais, setMateriais] = useState<Material[]>(dadosIniciais);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);


    async function carregarDados() {
        try {
            const resposta = await fetch(endpoint);
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dadosBrutos = await resposta.json();

            const dadosFormatados: Material[] = dadosBrutos.map((item: any) => ({
                id_stock: item.id_stock, 
                codigo: item.code,
                nome: item.name,
                tipo: item.id_type, 
                categoria: item.id_category,
                unidade: item.unitMeasure,
                etapa: item.allocatedStage,
                qtde: item.stockQuantity,
                massa: item.weightLength,
                comprimento: item.weightLength,
                atual: item.actualQuantity,
                minima: item.minQuantity,
                entrada_rec: item.recentInflow,
                entrada_acu: item.cumulativeInflow,
                saida_rec: item.recentOutflow,
                saida_acu: item.cumulativeOutflow,
                dt_ult_entrada: item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "-",
                dt_ult_saida: item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString()
                    : "-",
                id_budget: item.id_budget,
            }));

            setMateriais(dadosFormatados);
        } catch (erro) {
            console.error("Erro ao carregar materiais:", erro);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, [endpoint]); 

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-400">
                <FiLoader className="animate-spin mr-2" />
                Carregando dados...
            </div>
        );
    }

    // funcao de abrir e fechar modal
    const openCreateModal = () => {
        setMaterialToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (material: Material) => {
        setMaterialToEdit(material);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMaterialToEdit(null);
    };

    // funcao de deletar material
    const handleDelete = async (id_stock: number, nome: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o material '${nome}' (ID: ${id_stock})?`)) {
            try {
                const deleteEndpoint = `http://localhost:8080/stock/stockDelete/${id_stock}`; 

                const response = await fetch(deleteEndpoint, { 
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Falha HTTP: ${response.status}`);
                }

                await carregarDados(); 
            } catch (error) {
                console.error("Erro ao excluir material:", error);
                alert(`Erro ao excluir: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
            }
        }
    };

    return (
        <div className="h-[600px] w-full flex flex-col">
             {/*button adicionar material */}
            <div className="mb-4">
                <button 
                    onClick={openCreateModal}
                    className="bg-[#479A54] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#3d8547] transition-colors flex items-center"
                >
                    <FiEdit className="mr-2" /> Adicionar Material
                </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-[#c4c4c4] shadow-sm bg-white">
                <table className="min-w-full border-collapse">
                    <thead className="bg-white text-gray-700 sticky top-0 z-10">
                        <tr>
                            <th className="p-2 text-left">Código</th>
                            <th className="p-2 text-left">Nome</th>
                            <th className="p-2 text-left">Tipo</th>
                            <th className="p-2 text-left">Categoria</th>
                            <th className="p-2 text-left">Un. Medida</th>
                            <th className="p-2 text-left">Etapa</th>
                            <th className="p-2 text-center">Qtde</th>
                            <th className="p-2 text-center">Massa (Kg)</th>
                            <th className="p-2 text-center">Comp. (mm)</th>
                            <th className="p-2 text-center">Atual</th>
                            <th className="p-2 text-center">Mínima</th>
                            <th className="p-2 text-center">Entrada Rec.</th>
                            <th className="p-2 text-center">Entrada Acu.</th>
                            <th className="p-2 text-center">Saída Rec.</th>
                            <th className="p-2 text-center">Saída Acu.</th>
                            <th className="p-2 text-center">Dt. Últ. Entrada</th>
                            <th className="p-2 text-center">Dt. Últ. Saída</th>
                            <th className="p-2 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materiais.map((item, i) => (
                            <tr
                                key={i}
                                className="hover:bg-gray-50 border-b border-[#e0e0e0] transition-colors"
                            >
                                <td className="p-2">{item.codigo}</td>
                                <td className="p-2">{item.nome}</td>
                                <td className="p-2">{item.tipo}</td>
                                <td className="p-2">{item.categoria}</td>
                                <td className="p-2">{item.unidade}</td>
                                <td className="p-2">{item.etapa}</td>
                                <td className="p-2 text-center">{item.qtde}</td>
                                <td className="p-2 text-center">{item.massa}</td>
                                <td className="p-2 text-center">{item.comprimento}</td>
                                <td className="p-2 text-center">{item.atual}</td>
                                <td className="p-2 text-center">{item.minima}</td>
                                <td className="p-2 text-center">{item.entrada_rec}</td>
                                <td className="p-2 text-center">{item.entrada_acu}</td>
                                <td className="p-2 text-center">{item.saida_rec}</td>
                                <td className="p-2 text-center">{item.saida_acu}</td>
                                <td className="p-2 text-center">{item.dt_ult_entrada}</td>
                                <td className="p-2 text-center">{item.dt_ult_saida}</td>
                                <td className="p-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => openEditModal(item)}
                                            className="text-blue-600 hover:text-blue-800 font-semibold p-1 rounded-full hover:bg-blue-100 transition-colors"
                                            title="Editar"
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id_stock, item.nome)}
                                            className="text-red-600 hover:text-red-800 font-semibold p-1 rounded-full hover:bg-red-100 transition-colors"
                                            title="Excluir"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CrudMaterialModal 
                    material={materialToEdit} 
                    onClose={closeModal} 
                    onSave={() => {
                        carregarDados(); 
                        closeModal();
                    }}
                />
            )}
        </div>
    );
}