import { useState, useRef } from 'react';
import { Image, X, Plus } from 'lucide-react';

export function ImageUpload() {
  // Guarda as URLs das imagens para mostrar na tela
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Referência para clicar no input escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função que "clica" no input quando o usuário clica na div cinza
  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  // Função que roda quando o usuário escolhe os arquivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Calcula quantos espaços ainda temos (Máximo 6)
    const remainingSlots = 6 - previews.length;
    
    // Pega apenas a quantidade que cabe
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    // Cria URLs temporárias para exibir as imagens
    const newPreviews = filesToProcess.map(file => URL.createObjectURL(file));

    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Limpa o input para permitir selecionar a mesma foto novamente se quiser
    event.target.value = '';
  };

  // Função para remover uma foto da lista
  const removeImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir a janela de arquivos ao clicar no X
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full h-full flex flex-col">
        {/* Input Invisível */}
        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            multiple 
            accept="image/*"
        />

        {/* LÓGICA VISUAL:
            Se não tem fotos -> Mostra o quadrado cinza grande original.
            Se tem fotos -> Mostra um grid com as miniaturas.
        */}
        
        {previews.length === 0 ? (
            // --- ESTADO VAZIO (IGUAL AO FIGMA) ---
            <div 
                onClick={handleContainerClick}
                className="w-full h-56 bg-[#EEEEEE] border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            >
                <div className="text-gray-400 mb-2">
                    <Image size={64} strokeWidth={1.5} />
                </div>
                <span className="text-gray-400 text-sm font-medium">Adicionar Foto</span>
                <span className="text-gray-400 text-xs mt-1">(Máximo 6 imagens)</span>
            </div>
        ) : (
            // --- ESTADO COM FOTOS (GRID) ---
            <div className="w-full h-56 border border-gray-200 rounded-sm p-2 overflow-y-auto bg-white">
                <div className="grid grid-cols-3 gap-2">
                    {previews.map((src, index) => (
                        <div key={index} className="relative group w-full h-24 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                            <img src={src} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                            
                            {/* Botão de Remover (Aparece ao passar o mouse) */}
                            <button 
                                onClick={(e) => removeImage(index, e)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}

                    {/* Botãozinho para adicionar mais (se tiver menos de 6) */}
                    {previews.length < 6 && (
                        <div 
                            onClick={handleContainerClick}
                            className="w-full h-24 bg-[#F5F5F5] border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
                        >
                            <Plus size={24} className="text-gray-400" />
                            <span className="text-[10px] text-gray-500">Adicionar</span>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
}