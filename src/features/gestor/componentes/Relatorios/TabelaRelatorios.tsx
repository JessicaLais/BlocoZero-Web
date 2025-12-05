import React, { useState, useMemo, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Eye, Search, Image as ImageIcon } from "lucide-react";
import { api } from "../../../../services/api"; // Verifique se o caminho da api está certo
import  RelatorioDetalhesModal from "./ModalRelatorio"; 

// ✅ 1. Interface exportada corretamente para o Modal usar
export interface RelatorioDetalhado {
  id: string;
  data: string;
  nomeObra: string;
  status: 'PENDING' | 'VALIDATED' | 'REFUSED';
  
  etapa: string;
  subetapa: string;
  clima: string;
  inicio: string;
  fim: string;
  percentual: number;
  observacoes: string;
  imagemUrl?: string;
}

interface TabelaRelatoriosProps {
  workId?: string;
}

export default function TabelaRelatorios({ workId }: TabelaRelatoriosProps) {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VALIDATED' | 'REFUSED'>('PENDING');
  const [search, setSearch] = useState("");
  const [relatorios, setRelatorios] = useState<RelatorioDetalhado[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRelatorio, setSelectedRelatorio] = useState<RelatorioDetalhado | null>(null);

  // --- BUSCAR DADOS (GET) ---
  useEffect(() => {
    async function loadData() {
      if (!workId) return;

      try {
        setLoading(true);
        // Busca a lista do backend
        const response = await api.get(`/progressReport/list/${workId}`);
        const dadosBrutos = response.data.progressReports || [];

        // ✅ 2. ADAPTER: Converte Inglês (Back) -> Português (Front)
        const dadosAdaptados: RelatorioDetalhado[] = dadosBrutos.map((item: any) => {
          
          // Corrige a imagem Base64
          let fotoTratada = null;
          if (item.photo) {
             fotoTratada = item.photo.startsWith('data:') 
                ? item.photo 
                : `data:image/jpeg;base64,${item.photo}`;
          }

          return {
            id: item.id?.toString(),
            data: item.startDate,        
            nomeObra: item.work?.name || "Obra Atual",
            status: item.status || 'PENDING',
            
            etapa: item.id_stage?.toString() || "-",
            subetapa: item.id_substage?.toString() || "-",
            clima: item.weather || "Não informado",
            
            inicio: item.startDate,
            fim: item.endDate,
            percentual: Number(item.completionPercentage) || 0,
            
            observacoes: item.notes || "", // Traduz notes -> observacoes
            imagemUrl: fotoTratada
          };
        });

        setRelatorios(dadosAdaptados);

      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [workId]);

  // --- AÇÕES ---
  const handleAprovar = async () => {
    if (!selectedRelatorio) return;
    try {
      await api.patch(`/progressReport/review/${selectedRelatorio.id}`, {
        status: 'APROVADO' 
      });
      setRelatorios(prev => prev.map(r => r.id === selectedRelatorio.id ? { ...r, status: 'VALIDATED' } : r));
      setIsModalOpen(false);
    } catch (err) { alert("Erro ao validar."); }
  };

  const handleRecusar = async () => {
    if (!selectedRelatorio) return;
    const motivo = prompt("Qual o motivo da recusa?");
    if (!motivo) return;

    try {
      await api.patch(`/progressReport/review/${selectedRelatorio.id}`, {
        status: 'INVALIDO',
        reason: motivo
      });
      setRelatorios(prev => prev.map(r => r.id === selectedRelatorio.id ? { ...r, status: 'REFUSED' } : r));
      setIsModalOpen(false);
    } catch (err) { alert("Erro ao recusar."); }
  };

  // --- FILTROS ---
  const listaFiltrada = useMemo(() => {
    return relatorios.filter(r => {
      let statusNormalizado = 'PENDING';
      if ( r.status === 'VALIDATED') statusNormalizado = 'VALIDATED';
      if ( r.status === 'REFUSED') statusNormalizado = 'REFUSED';

      const matchesTab = statusNormalizado === activeTab;
      const term = search.toLowerCase();
      const matchesSearch = r.observacoes.toLowerCase().includes(term) || 
                            r.etapa.toLowerCase().includes(term);
      
      return matchesTab && matchesSearch;
    });
  }, [relatorios, activeTab, search]);

  const formatDate = (dateStr?: string) => {
    if(!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-[#c4c4c4] flex flex-col w-full h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex bg-gray-200 p-1 rounded-lg">
           <button onClick={() => setActiveTab('PENDING')} className={`px-4 py-2 rounded text-sm font-medium flex gap-2 ${activeTab === 'PENDING' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}><Clock size={16}/> Pendente</button>
           <button onClick={() => setActiveTab('VALIDATED')} className={`px-4 py-2 rounded text-sm font-medium flex gap-2 ${activeTab === 'VALIDATED' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}><CheckCircle size={16}/> Validado</button>
           <button onClick={() => setActiveTab('REFUSED')} className={`px-4 py-2 rounded text-sm font-medium flex gap-2 ${activeTab === 'REFUSED' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}><XCircle size={16}/> Recusado</button>
        </div>
        <div className="relative w-64">
           <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-[#607D8B]" />
           <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading && <div className="text-center py-10 text-gray-500">Carregando...</div>}
        {!loading && listaFiltrada.length === 0 && <div className="text-center py-10 text-gray-400">Nenhum relatório encontrado.</div>}

        {listaFiltrada.map(rel => (
          <div key={rel.id} className="flex justify-between items-center p-4 border-b hover:bg-gray-50 bg-white rounded mb-2 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
               <span className="text-xs font-bold bg-gray-100 border px-2 py-1 rounded text-gray-600">
                 {formatDate(rel.data)}
               </span>
               <div>
                 <p className="font-semibold text-gray-700 text-sm">Etapa: {rel.etapa} - Sub: {rel.subetapa}</p>
                 <span className="text-xs text-gray-400 capitalize">{rel.clima}</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
                {rel.imagemUrl && <ImageIcon size={16} className="text-blue-400" />}
                <button onClick={() => { setSelectedRelatorio(rel); setIsModalOpen(true); }} className="p-2 hover:bg-gray-200 rounded-full">
                    <Eye size={16} className="text-gray-600" />
                </button>
            </div>
          </div>
        ))}
      </div>

      <RelatorioDetalhesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        relatorio={selectedRelatorio} 
        onAprovar={handleAprovar}
        onRecusar={handleRecusar}
      />
    </div>
  );
}