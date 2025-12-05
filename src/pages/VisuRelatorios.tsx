import TabelaRelatorios from "../features/gestor/componentes/Relatorios/TabelaRelatorios";
import { useParams } from "react-router-dom";

export const RelatoriosGestorPage = () => {
  // Pega o ID da URL (ex: se a URL for /obra/123/relatorios, work_id será "123")
  const { work_id } = useParams<{ work_id: string }>();

  return (
    <div className="p-6 bg-gray-50 flex flex-col w-full h-full min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#607D8B] rounded-md"></span>
        Relatórios - Progresso Físico (Obra {work_id})
      </h1>

      <div className="w-full flex-1">
        {/* Passamos o ID para a tabela saber o que buscar */}
        <TabelaRelatorios workId={work_id} />
      </div>
    </div>
  );
};