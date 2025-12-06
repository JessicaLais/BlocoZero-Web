import { useState } from "react";
import { Upload, X } from "lucide-react"; // Ou os ícones que você usa

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Passa o arquivo para o Pai (Relatorios.tsx)
      if (onImageSelect) onImageSelect(file);
      
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onImageSelect) onImageSelect(null);
  };

  return (
    // ... (seu código visual do quadrado de upload) ...
    // O importante é que no input type="file" tenha: onChange={handleFileChange}
    <div className="w-full flex flex-col items-center gap-4">
        {/* Exemplo simplificado da estrutura visual */}
        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative bg-gray-50">
             {preview ? (
                <>
                    <img src={preview} alt="Preview" className="h-full object-contain" />
                    <button onClick={handleRemove} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={16}/></button>
                </>
             ) : (
                <label className="cursor-pointer flex flex-col items-center">
                    <Upload size={32} className="text-gray-400 mb-2"/>
                    <span className="text-gray-500">Clique para enviar foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
             )}
        </div>
    </div>
  );
}