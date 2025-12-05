import { useEffect, useState } from "react";
import { FormCadastroObra } from "../features/gestor/componentes/cadastroMateriais/FormCadastroObra";
import { SessionItem, type SessionItemProps } from "../features/home/components/Session";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom"; 

export function CadastroObra() {
    const navigate = useNavigate();
    const [works, setWorks] = useState<SessionItemProps[]>([]);
    
    // Defina o ID da empresa aqui (ou pegue do contexto de autenticação/login)
    const ENTERPRISE_ID = 1; 

    async function fetchWorks() {
        try {
            // CORREÇÃO AQUI: Adicionado o ID da empresa na URL
            const response = await api.get(`/work/list/${ENTERPRISE_ID}`); 
            
            console.log("Dados recebidos:", response.data); // Para debug

            // Verificação de segurança caso o backend retorne objeto ou array
            const data = response.data;
            if (Array.isArray(data)) {
                setWorks(data);
            } else if (data.works && Array.isArray(data.works)) {
                setWorks(data.works);
            } else {
                setWorks([]); 
            }
        } catch (error) {
            console.error("Erro ao buscar obras", error);
            // Se quiser manter os dados falsos para teste enquanto arruma o back:
            // setWorks([... dados falsos ...]);
        }
    }

    useEffect(() => {
        fetchWorks();
    }, []);

    function handleSelectWork(id: string) {
        navigate(`/obras/${id}`);
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white p-2">
            {/* Parte Superior: Formulário (Sem alterações) */}
            <div className="py-2 bg-white border-1 border-gray-300 rounded-lg mb-2">
                <h1 className="text-2xl font-bold ml-5 text-gray-800">Criar Obra</h1>
                <FormCadastroObra onSuccess={fetchWorks} />
            </div>

            {/* Parte Inferior: Lista de Obras */}
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col gap-1 max-h-[220px] w-[720px] border-1 border-gray-300 rounded-lg overflow-y-scroll ">
                    <h2 className="text-xl font-semibold p-2 text-gray-700">Obras Registradas</h2>
                    <div className="p-2 flex-col gap-2">
                        {works.length > 0 ? (
                            works.map((work) => (
                                <SessionItem 
                                    key={work.id_work} 
                                    data={work} 
                                    onClick={() => handleSelectWork(work.id_work)}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Nenhuma obra encontrada para esta empresa.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )

}