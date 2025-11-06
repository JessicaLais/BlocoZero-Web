import ResumoMovimentacao from "../features/gestor/componentes/MovimentacaoEstoque";
import TabelaMateriais from "../features/gestor/componentes/TabelaMateriais";
import { useEffect, useState } from "react";

export default function EstoqueTabela() {
  const [materiais, setMateriais] = useState([]);

  // Endpoint 
  const endpoint = "http://localhost:8080/stock/stockGetAll";

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await fetch(endpoint);
        const dados = await resposta.json();
        setMateriais(dados);
      } catch (erro) {
        console.error("Erro ao carregar materiais:", erro);
      }
    }
    carregarDados();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#607D8B] rounded-md"></span>
        Controle de Estoque da Obra
      </h1>

      {/* Cards de movimentação */}
      <ResumoMovimentacao materiais={materiais} />

      {/* Tabela de materiais */}
      <TabelaMateriais endpoint={endpoint} />
    </div>
  );
}
