// components/EstoqueTab.tsx

import ResumoMovimentacao from "../features/gestor/componentes/estoque-tabela/MovimentacaoEstoque";
import TabelaMateriais from "../features/gestor/componentes/estoque-tabela/TabelaMateriais";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi"; 

export default function EstoqueTab() {
  const [materiais, setMateriais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  
  const endpoint = "http://localhost:8080/stock/stockGetAvailable";

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await fetch(endpoint);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();
        setMateriais(dados);
      } catch (erro) {
        console.error("Erro ao carregar materiais:", erro);
      } finally {
        setLoading(false); 
      }
    }
    carregarDados();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <FiLoader className="animate-spin mr-2" size={24} />
        Carregando dados do estoque...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#607D8B] rounded-md"></span>
        Controle de Estoque da Obra
      </h1>

      <ResumoMovimentacao materiais={materiais} />

      {/* 💡 PASSAR OS DADOS E O ENDPOINT PARA AÇÕES CRUD */}
      <TabelaMateriais dadosIniciais={materiais} endpoint={endpoint} /> 
    </div>
  );
}