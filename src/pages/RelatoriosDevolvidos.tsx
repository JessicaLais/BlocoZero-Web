import { useState } from "react";
import { Eye, AlertTriangle, FileText } from "lucide-react";
// IMPORTANTE: Aqui importamos o componente que criamos no Passo 1
import { ModalFeedback } from "../features/relatorios/components/ModalFeedback";

export function RelatoriosDevolvidos() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // MOCK DE DADOS (Para testar o visual)
  const designPreview = [
    {
      id: 1,
      date: "29/10/2025",
      obra: "Residencial Flores",
      etapa: "Fundação - Sapatas",
      status: "Recusado",
      motivo: "A foto enviada está muito escura. Por favor, tire uma nova foto com flash.",
    },
    {
      id: 2,
      date: "30/10/2025",
      obra: "Comercial Centro",
      etapa: "Alvenaria",
      status: "Recusado",
      motivo: "O percentual informado não bate com o cronograma. Verifique se digitou 80% corretamente.",
    }
  ];

  const handleOpenDetails = (report: any) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full p-8 bg-white min-h-screen">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="text-red-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
                Relatórios Devolvidos
            </h1>
        </div>
        <div className="w-full h-[1px] bg-gray-300"></div>
        <p className="text-sm text-gray-500 mt-2">
            Relatorios recusados pelo Gestor
        </p>
      </div>

      {/* Lista */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-gray-100 p-3 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <div className="col-span-2">Data</div>
            <div className="col-span-4">Obra</div>
            <div className="col-span-4">Etapa</div>
            <div className="col-span-2 text-center">Ação</div>
        </div>

        <div className="divide-y divide-gray-200 bg-white">
            {designPreview.map((item) => (
                <div 
                    key={item.id} 
                    className="grid grid-cols-12 p-4 items-center hover:bg-red-50 transition-colors group"
                >
                    <div className="col-span-2 text-sm text-gray-700 font-medium">
                        {item.date}
                    </div>
                    <div className="col-span-4 text-sm text-gray-800">
                        {item.obra}
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">{item.etapa}</span>
                        <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 font-medium">
                            <AlertTriangle size={10} />
                            Recusado
                        </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <button 
                            onClick={() => handleOpenDetails(item)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            title="Ver motivo"
                        >
                            <Eye size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* O componente que estava dando erro agora deve funcionar */}
      <ModalFeedback 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedReport} 
      />

    </div>
  );
}