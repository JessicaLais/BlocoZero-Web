import { useState, useMemo, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Eye, Search, Image as ImageIcon } from "lucide-react";
import { api } from "../../../../services/api"; 
import RelatorioDetalhesModal from "./ModalRelatorio"; 

// ✅ Interface ajustada para o nome real que veio no seu console
interface BackendReport {
    id_progressSubstageReport?: number; // O CAMPO CORRETO DO ID
    id_progressReport?: number;         // Mantido por garantia
    id?: number;
    id_work?: number;
    id_stage?: number;
    id_substage?: number; 
    title?: string;
    reportVersion?: string;
    createdAt?: string; 
    weather?: string;
    startDate?: string;
    endDate?: string;
    note?: string;
    status?: string; 
    completionPercentage?: number | string; 
    photo?: string; 
    work?: { name: string };
}

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
    titulo?: string;
}

interface TabelaRelatoriosProps {
    workId?: string;
}

export default function TabelaRelatorios({ workId }: TabelaRelatoriosProps) {
    const statusMap: Record<string, 'PENDING' | 'VALIDATED' | 'REFUSED'> = {
        'PENDENTE': 'PENDING',
        'PENDING': 'PENDING',
        'APROVADO': 'VALIDATED',
        'VALIDATED': 'VALIDATED',
        'INVALIDO': 'REFUSED',
        'REFUSED': 'REFUSED'
    };

    const [activeTab, setActiveTab] = useState<'PENDING' | 'VALIDATED' | 'REFUSED'>('PENDING');
    const [search, setSearch] = useState("");
    const [relatorios, setRelatorios] = useState<RelatorioDetalhado[]>([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRelatorio, setSelectedRelatorio] = useState<RelatorioDetalhado | null>(null);

    useEffect(() => {
        if (!workId) {
            setRelatorios([]);
            return;
        }

        const idNumber = Number(workId);
        if (isNaN(idNumber) || idNumber <= 0) {
            console.warn("ID da obra inválido:", workId);
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                const urlRequest = `/progressReport/list/${idNumber}`;
                
                const response = await api.get(urlRequest);
                const dadosBrutos: BackendReport[] = response.data.progressReports || [];
                
                // console.log("Dados recebidos:", dadosBrutos); 

                const dadosAdaptados: RelatorioDetalhado[] = dadosBrutos.map((item) => {
                    
                    // 1. Tratamento da Imagem
                    let fotoTratada = undefined;
                    if (item.photo) {
                        fotoTratada = item.photo.startsWith('data:') 
                            ? item.photo 
                            : `data:image/jpeg;base64,${item.photo}`;
                    }
                    
                    // 2. Tratamento do Status
                    const statusBackend = item.status || 'PENDENTE';
                    const statusFrontend = statusMap[statusBackend] || 'PENDING';

                    // ✅ 3. CORREÇÃO PRINCIPAL: Pegando o ID correto
                    const safeId = 
                        item.id_progressSubstageReport?.toString() || // Prioridade 1: O nome que vimos no console
                        item.id_progressReport?.toString() || 
                        item.id?.toString() || 
                        `temp-${Math.random()}`;

                    return {
                        id: safeId,
                        data: item.createdAt || item.startDate || new Date().toISOString(),        
                        nomeObra: item.work?.name || "Obra",
                        status: statusFrontend,
                        
                        etapa: item.id_stage?.toString() || "-",
                        subetapa: item.id_substage?.toString() || "-",
                        
                        clima: item.weather || "-",
                        inicio: item.startDate || "",
                        fim: item.endDate || "",
                        percentual: Number(item.completionPercentage) || 0,
                        
                        observacoes: item.note || "", 
                        titulo: item.title || "",
                        imagemUrl: fotoTratada
                    };
                });

                setRelatorios(dadosAdaptados);

            } catch (error: any) {
                console.error("Erro ao buscar relatórios:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [workId]);

    const handleAprovar = async () => {
        if (!selectedRelatorio) return;
        try {
            // Agora selectedRelatorio.id será "1" (o ID real), então a URL ficará correta
            await api.patch(`/progressReport/review/${selectedRelatorio.id}`, {
                status: 'APROVADO', 
                reason: 'Aprovado pelo gestor' 
            });
            
            setRelatorios(prev => prev.map(r => 
                r.id === selectedRelatorio.id ? { ...r, status: 'VALIDATED' } : r
            ));
            setIsModalOpen(false);
        } catch (err) { 
            console.error(err);
            alert("Erro ao validar. Verifique o console."); 
        }
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

            setRelatorios(prev => prev.map(r => 
                r.id === selectedRelatorio.id ? { ...r, status: 'REFUSED' } : r
            ));
            setIsModalOpen(false);
        } catch (err) { 
            console.error(err);
            alert("Erro ao recusar."); 
        }
    };

    const listaFiltrada = useMemo(() => {
        return relatorios.filter(r => {
            const matchesTab = r.status === activeTab;
            const term = search.toLowerCase();
            const matchesSearch = 
                (r.observacoes && r.observacoes.toLowerCase().includes(term)) || 
                (r.etapa && r.etapa.toLowerCase().includes(term)) ||
                (r.titulo && r.titulo?.toLowerCase().includes(term));
            
            return matchesTab && matchesSearch;
        });
    }, [relatorios, activeTab, search]);

    const formatDate = (dateStr?: string) => {
        if(!dateStr) return "-";
        try {
            return new Date(dateStr).toLocaleDateString('pt-BR');
        } catch (e) {
            return dateStr;
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-[#c4c4c4] flex flex-col w-full h-[440px]">
            {/* Header / Tabs */}
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
                
                {!loading && listaFiltrada.length === 0 && (
                    <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-20"/>
                        Nenhum relatório encontrado.
                    </div>
                )}

                {listaFiltrada.map(rel => (
                    <div key={rel.id} className="flex justify-between items-center p-4 border-b hover:bg-gray-50 bg-white rounded mb-2 shadow-sm border border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold bg-gray-200 border px-2 py-1 rounded text-gray-600 min-w-[80px] text-center">
                                {formatDate(rel.data)}
                            </span>
                            <div>
                                <p className="font-semibold text-gray-700 text-sm">
                                    {rel.titulo ? rel.titulo : `Etapa: ${rel.etapa}`}
                                </p>
                                <span className="text-xs text-gray-400 capitalize flex items-center gap-1">
                                    {rel.clima} • {rel.percentual}%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {rel.imagemUrl && <ImageIcon size={16} className="text-blue-400" />}
                            <button 
                                onClick={() => { setSelectedRelatorio(rel); setIsModalOpen(true); }} 
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                title="Ver detalhes"
                            >
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