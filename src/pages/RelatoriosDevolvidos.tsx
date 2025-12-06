import { useState } from "react";
import { Eye, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { ModalFeedback } from "../features/relatorios/components/ModalFeedback";

// IMPORTANDO SEUS ÍCONES PERSONALIZADOS
import IconePendente from "../assets/pendenteRelatorio.svg";
import IconeValidado from "../assets/aceitarRelatorio.svg";
import IconeRecusado from "../assets/recusarRelatorio.svg";


type StatusRelatorio = "Pendente" | "Validado" | "Recusado";

export function RelatoriosDevolvidos() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // REMOVIDO "Todos". O estado inicial agora é "Pendente"
  const [filtroAtivo, setFiltroAtivo] = useState<StatusRelatorio>("Pendente");

  // MOCK DE DADOS (Pode manter por enquanto até o backend chegar)
  const allReports = [
    {
      id: 1,
      date: "29/10/2025",
      obra: "Residencial Flores",
      etapa: "Fundação",
      status: "Recusado" as StatusRelatorio,
      motivo: "A foto enviada está muito escura. Por favor, tire uma nova foto com flash.",
    },
    {
      id: 2,
      date: "30/10/2025",
      obra: "Comercial Centro",
      etapa: "Alvenaria",
      status: "Pendente" as StatusRelatorio,
      motivo: null,
    },
    {
      id: 3,
      date: "28/10/2025",
      obra: "Shopping Plaza",
      etapa: "Acabamento",
      status: "Validado" as StatusRelatorio,
      motivo: null,
    }
  ];

  // A lógica de filtro simplificou, agora sempre filtra pelo status ativo
  const filteredReports = allReports.filter(r => r.status === filtroAtivo);

  const handleOpenDetails = (report: any) => {
    if (report.motivo) {
        setSelectedReport(report);
        setIsModalOpen(true);
    }
  };

  const renderStatus = (status: StatusRelatorio) => {
    switch (status) {
        case "Recusado":
            return (
                <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 font-bold uppercase tracking-wide">
                    <AlertTriangle size={12} /> Recusado
                </span>
            );
        case "Pendente":
            return (
                <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 font-bold uppercase tracking-wide">
                    <Clock size={12} /> Pendente
                </span>
            );
        case "Validado":
            return (
                <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 font-bold uppercase tracking-wide">
                    <CheckCircle size={12} /> Validado
                </span>
            );
    }
  };

  return (
    <div className="w-full p-8 bg-white min-h-screen">
      
      {/* Cabeçalho Limpo (Sem ícone preto) */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
            <h1 className="text-xl font-bold text-gray-800">
                Meus Relatórios
            </h1>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

        {/* FILTROS COM ÍCONES DO FIGMA */}
        <div className="flex gap-3">
            
            {/* Botão Pendente */}
            <button 
                onClick={() => setFiltroAtivo("Pendente")}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    filtroAtivo === "Pendente" 
                    ? "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D] shadow-sm" 
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
            >
                <img src={IconePendente} alt="Pendente" className="w-4 h-4" />
                Pendentes
            </button>

            {/* Botão Validado */}
            <button 
                onClick={() => setFiltroAtivo("Validado")}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    filtroAtivo === "Validado" 
                    ? "bg-[#D1FAE5] text-[#059669] border-[#6EE7B7] shadow-sm" 
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
            >
                <img src={IconeValidado} alt="Validado" className="w-4 h-4" />
                Validados
            </button>

            {/* Botão Recusado */}
            <button 
                onClick={() => setFiltroAtivo("Recusado")}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    filtroAtivo === "Recusado" 
                    ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] shadow-sm" 
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
            >
                <img src={IconeRecusado} alt="Recusado" className="w-4 h-4" />
                Recusados
            </button>

        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm mt-4">
        
        <div className="grid grid-cols-12 bg-[#E5E7EB] p-3 border-b border-gray-300 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <div className="col-span-2">Data</div>
            <div className="col-span-6">Obra / Etapa</div>
            <div className="col-span-4 text-center">Status / Ação</div>
        </div>

        <div className="divide-y divide-gray-200 bg-white">
            {filteredReports.map((item) => (
                <div 
                    key={item.id} 
                    className="grid grid-cols-12 p-4 items-center hover:bg-gray-50 transition-colors group"
                >
                    <div className="col-span-2 text-sm text-gray-700 font-medium">
                        {item.date}
                    </div>
                    
                    <div className="col-span-6 flex flex-col">
                        <span className="text-sm text-gray-900 font-bold">{item.obra}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{item.etapa}</span>
                    </div>

                    <div className="col-span-4 flex justify-center items-center gap-4">
                        
                        {renderStatus(item.status)}

                        {item.status === "Recusado" && (
                            <button 
                                onClick={() => handleOpenDetails(item)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                title="Ver motivo da recusa"
                            >
                                <Eye size={20} />
                            </button>
                        )}
                        
                        {item.status !== "Recusado" && (
                             <div className="w-9 h-9"></div> 
                        )}
                    </div>
                </div>
            ))}
            
            {filteredReports.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                    Nenhum relatório encontrado neste filtro.
                </div>
            )}
        </div>
      </div>

      <ModalFeedback 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedReport} 
      />

    </div>
  );
}