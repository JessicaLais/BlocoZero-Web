import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface Material {
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
}

interface TabelaMateriaisProps {
  endpoint: string;
}

export default function TabelaMateriais({ endpoint }: TabelaMateriaisProps) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await fetch(endpoint);
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
      <div className="flex items-center justify-center h-32 text-gray-400">
        <FiLoader className="animate-spin mr-2" />
        Carregando dados...
      </div>
    );
  }

  if (materiais.length === 0) {
    return <p className="text-center text-gray-500">Nenhum material encontrado.</p>;
  }

  return (
  <div className="h-full w-full flex flex-col">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

}
