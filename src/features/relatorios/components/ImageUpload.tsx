import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';

// Adicionamos uma prop para devolver o arquivo
interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 1. Cria o preview visual
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // 2. Manda o arquivo real para o pai
    onImageSelect(file);
    
    event.target.value = '';
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null); // Avisa o pai que removeu
  };

  return (
    <div className="w-full h-full flex flex-col">
        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept="image/*"
        />

        {!preview ? (
            <div 
                onClick={handleContainerClick}
                className="w-full h-56 bg-[#EEEEEE] border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            >
                <div className="text-gray-400 mb-2">
                    <Image size={64} strokeWidth={1.5} />
                </div>
                <span className="text-gray-400 text-sm font-medium">Adicionar Foto</span>
            </div>
        ) : (
            <div className="w-full h-56 bg-gray-100 border border-gray-300 rounded-sm relative group overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                    title="Remover imagem"
                >
                    <X size={16} />
                </button>
            </div>
        )}
    </div>
  );
}