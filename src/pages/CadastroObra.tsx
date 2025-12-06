import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react"; // Opcional: ícones para o botão

// Componentes
import { FormCadastroObra } from "../features/gestor/componentes/cadastroMateriais/FormCadastroObra";
import { ListaSelecaoObra } from "../shared/ListaSelecaoObra";

export function CadastroObra() {
    const navigate = useNavigate();
    
    // Estado para alternar entre Lista e Formulário
    const [showForm, setShowForm] = useState(false);

    // Função chamada quando clica em um item da lista
    function handleSelectWork(id: string) {
        navigate(`/obras/${id}`);
    }

    // Função chamada quando o formulário salva com sucesso
    const handleFormSuccess = () => {
        // Apenas fechar o formulário é suficiente. 
        // Quando a ListaSelecaoObra for renderizada novamente, 
        // o useEffect dela rodará e buscará os dados atualizados.
        setShowForm(false);
    };

    return (
        <div className="h-screen bg-[#F5F5F5] p-4 md:p-2 overflow-hidden">
            
            {/* CABEÇALHO DA PÁGINA */}
            {/* Centralizado e com largura máxima para alinhar visualmente com o componente de lista */}
            <div className="flex flex-col md:flex-row justify-end items-center  max-w-[768px] mx-auto w-full gap-4">
                

                {/* BOTÃO DE ALTERNÂNCIA (TOGGLE) */}
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                        showForm 
                        ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" 
                        : "bg-green-400 text-white hover:bg-green-350 hover:shadow-md"      
                    }`}
                >
                    {showForm ? (
                        <>
                            <ArrowLeft size={20} /> Voltar para Lista
                        </>
                    ) : (
                        <>
                            <Plus size={20} /> Cadastrar Nova Obra
                        </>
                    )}
                </button>
            </div>

            {/* ÁREA DE CONTEÚDO */}
            <div className="w-full flex justify-center">
                
                {showForm ? (
                    // --- MODO FORMULÁRIO ---
                    <div className="w-full  bg-white border border-gray-300 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <FormCadastroObra onSuccess={handleFormSuccess} />
                    </div>
                ) : (
                    // --- MODO LISTAGEM (Componente Shared) ---
                    // O componente ListaSelecaoObra já possui seu próprio container e estilos,
                    // então apenas passamos as props necessárias.
                    <div className="w-full animate-in fade-in duration-300">
                        <ListaSelecaoObra 
                            title="Obras Registradas"
                            onSelect={handleSelectWork}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}