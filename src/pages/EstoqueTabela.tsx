import ResumoMovimentacao from "../features/gestor/componentes/estoque-tabela/MovimentacaoEstoque";
import TabelaMateriais from "../features/gestor/componentes/estoque-tabela/TabelaMateriais";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

// Interface simplificada para o que é usado em ResumoMovimentacao
interface MaterialResumo {
  entrada_rec: number;
  entrada_acu: number;
  saida_rec: number;
  saida_acu: number;
}

export default function EstoqueTab() {
  // Dados do resumo para os cards
  const [dadosResumo, setDadosResumo] = useState<MaterialResumo[]>([]);
  const [loading, setLoading] = useState(true);

  // Endpoint de listagem, usando work_id=1 como exemplo
  const workId = 1;
  const endpoint = `http://localhost:8080/stock/list/${workId}`;

  useEffect(() => {
    async function carregarDadosDeResumo() {
      try {
        const resposta = await fetch(endpoint);
        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const listaMateriais = dados.stock || [];

        if (!Array.isArray(listaMateriais)) {
          throw new Error("Formato de dados inesperado da API.");
        }

        // Apenas passamos os dados de entrada/saída para o resumo
        const resumoFormatado: MaterialResumo[] = listaMateriais.map((item: any) => ({
          entrada_rec: item.recentInflow,
          entrada_acu: item.cumulativeInflow,
          saida_rec: item.recentOutflow,
          saida_acu: item.cumulativeOutflow,
        }));

        setDadosResumo(resumoFormatado);
      } catch (erro) {
        console.error("Erro ao carregar dados de resumo:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDeResumo();
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
    <div className="p-6 bg-gray-50 flex flex-col w-full h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#607D8B] rounded-md"></span>
        Controle de Estoque da Obra
      </h1>

      {/* Passa os dados de resumo para o ResumoMovimentacao */}
      <ResumoMovimentacao materiais={dadosResumo} />

      {/* TabelaMateriais carrega os dados da API */}
      <TabelaMateriais endpoint={endpoint} />
    </div>
  );
}
