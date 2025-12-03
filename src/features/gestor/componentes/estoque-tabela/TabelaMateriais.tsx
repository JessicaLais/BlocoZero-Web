import { useEffect, useState, useMemo } from "react";
import { FiLoader, FiFilter, FiSearch, FiX } from "react-icons/fi";

// Interface Material
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
}

// Props do componente
interface TabelaMateriaisProps {
  endpoint: string;
}

// Parâmetros de filtro
interface FilterParams {
  codigo: string;
  categoria: string;
}

export default function TabelaMateriais({ endpoint }: TabelaMateriaisProps) {
  const [materiaisBrutos, setMateriaisBrutos] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltrosOpen, setIsFiltrosOpen] = useState(false);

  const [filterParams, setFilterParams] = useState<FilterParams>({
    codigo: '',
    categoria: '',
  });

  const toggleFiltros = () => setIsFiltrosOpen(!isFiltrosOpen);

  // Buscar dados da API
  async function carregarDados() {
    setLoading(true);
    try {
      const resposta = await fetch(endpoint);
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }

      const dados = await resposta.json();
      const dadosBrutos = dados.stock || dados;

      if (!Array.isArray(dadosBrutos)) {
        throw new Error("Formato de dados inesperado da API.");
      }

      const dadosFormatados: Material[] = dadosBrutos.map((item: any) => ({
        id_stock: item.id_stock,
        codigo: item.code,
        nome: item.name,
        tipo: item.id_type ? String(item.id_type) : '',
        categoria: item.id_category ? String(item.id_category) : '',
        unidade: item.unitMeasure,
        etapa: item.stage ? String(item.stage) : '',
        qtde: item.stockQuantity,
        massa: item.weightLength,
        comprimento: item.weightLength,
        atual: item.actualQuantity,
        minima: item.minQuantity,
        entrada_rec: item.recentInflow,
        entrada_acu: item.cumulativeInflow,
        saida_rec: item.recentOutflow,
        saida_acu: item.cumulativeOutflow,
      }));

      setMateriaisBrutos(dadosFormatados);
    } catch (erro) {
      console.error("Erro ao carregar materiais:", erro);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [endpoint]);

  // Filtragem
  const materiaisFiltrados = useMemo(() => {
    if (!filterParams.codigo && !filterParams.categoria) return materiaisBrutos;

    return materiaisBrutos.filter(item => {
      const codigoMatch = item.codigo.toLowerCase().includes(filterParams.codigo.toLowerCase());
      const categoriaMatch = item.categoria.toLowerCase().includes(filterParams.categoria.toLowerCase());
      return codigoMatch && categoriaMatch;
    });
  }, [materiaisBrutos, filterParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        <FiLoader className="animate-spin mr-2" />
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Botão de filtros */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          {materiaisFiltrados.length} materiais encontrados.
        </p>
        <button
          onClick={toggleFiltros}
          className={`flex items-center px-4 py-2 font-semibold rounded-lg shadow-md transition-colors ${
            isFiltrosOpen ? 'bg-[#9A2020] hover:bg-[#7a1a1a] text-white' : 'bg-[#607D8B] hover:bg-[#455A64] text-white'
          }`}
        >
          {isFiltrosOpen ? (
            <>
              <FiX className="mr-2" />
              Fechar
            </>
          ) : (
            <>
              <FiFilter className="mr-2" />
              Pesquisar
            </>
          )}
        </button>
      </div>

      {/* Painel de filtros */}
      {isFiltrosOpen && (
        <div className="bg-white p-4 mb-4 rounded-2xl border border-[#c4c4c4] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por Código</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Digite o código..."
                value={filterParams.codigo}
                onChange={(e) => setFilterParams({ ...filterParams, codigo: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#607D8B] focus:border-[#607D8B] outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Categoria</label>
            <select
              value={filterParams.categoria}
              onChange={(e) => setFilterParams({ ...filterParams, categoria: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#607D8B] focus:border-[#607D8B] outline-none bg-white"
            >
              <option value="">Todas as Categorias</option>
              {Array.from(new Set(materiaisBrutos.map(m => m.categoria))).sort().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Limpar filtros */}
          <div className="flex items-end">
            <button
              onClick={() => setFilterParams({ codigo: '', categoria: '' })}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-y-auto rounded-2xl w-[1350px] h-[400px] border border-[#c4c4c4] shadow-sm bg-white">
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
            </tr>
          </thead>
          <tbody>
            {materiaisFiltrados.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 border-b border-[#e0e0e0] transition-colors">
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
              </tr>
            ))}
          </tbody>
        </table>
        {materiaisFiltrados.length === 0 && !loading && (
          <div className="text-center p-8 text-gray-500">
            Nenhum material encontrado com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
