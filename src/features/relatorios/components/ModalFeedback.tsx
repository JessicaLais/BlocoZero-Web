import { X, AlertCircle } from "lucide-react";
import { Button } from "../../auth/components/Button";

// Interface do que esperamos mostrar (Design)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Dados visuais que o modal precisa
  data: {
    obra: string;
    etapa: string;
    motivo: string;
  } | null;
}

export function ModalFeedback({ isOpen, onClose, data }: ModalProps) {
  if (!isOpen || !data) return null;

  return (
    // Fundo escuro (Overlay) fixo na tela toda
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      
      {/* O Card do Modal (Branco e centralizado) */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative animate-fade-in">
        
        {/* Cabeçalho: Vermelho claro para indicar atenção */}
        <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={24} />
            <h2 className="font-bold text-lg">Correção Solicitada</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-6">
          
          {/* Informações de Contexto (Obra/Etapa) */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase font-semibold">Obra</span>
                <span className="text-gray-800 font-medium">{data.obra}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase font-semibold">Etapa</span>
                <span className="text-gray-800 font-medium">{data.etapa}</span>
            </div>
          </div>

          {/* O Motivo (Destaque visual) */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <span className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Mensagem do Gestor:
            </span>
            <p className="text-gray-800 text-sm leading-relaxed italic">
              "{data.motivo}"
            </p>
          </div>

          {/* Instrução visual */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
            Necessário editar e reenviar o relatório.
          </div>
        </div>

        {/* Rodapé com Botões */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <Button 
            onClick={onClose} 
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 w-24 h-9 text-sm shadow-none"
          >
            Fechar
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700 border-none w-32 h-9 text-sm shadow-md"
            onClick={() => alert("Redirecionar para edição...")}
          >
            Corrigir
          </Button>
        </div>

      </div>
    </div>
  );
}