import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { FiX, FiSave } from "react-icons/fi";


interface Material {
  id_stock?: number; 
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
  id_budget: number; 
}

interface CrudMaterialModalProps {
  material: Material | null; 
  onClose: () => void;
  onSave: () => void;
}

const initialMaterialState: Material = {
  codigo: "",
  nome: "",
  tipo: "",
  categoria: "",
  unidade: "",
  etapa: "",
  qtde: 0,
  massa: 0,
  comprimento: 0,
  atual: 0,
  minima: 0,
  entrada_rec: 0,
  entrada_acu: 0,
  saida_rec: 0,
  saida_acu: 0,
  id_budget: 1, 
};

export default function CrudMaterialModal({ material, onClose, onSave }: CrudMaterialModalProps) {
  const [formData, setFormData] = useState<Material>(initialMaterialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = material !== null && material.id_stock !== undefined;
  const modalTitle = isEditMode ? "Editar Material de Estoque" : "Adicionar Novo Material";

 
  useEffect(() => {
    if (material) {
      setFormData({
        id_stock: material.id_stock,
        codigo: material.codigo,
        nome: material.nome,
        tipo: material.tipo,
        categoria: material.categoria,
        unidade: material.unidade,
        etapa: material.etapa,
        qtde: material.qtde,
        massa: material.massa,
        comprimento: material.comprimento,
        atual: material.atual,
        minima: material.minima,
        entrada_rec: material.entrada_rec,
        entrada_acu: material.entrada_acu,
        saida_rec: material.saida_rec,
        saida_acu: material.saida_acu,
        id_budget: material.id_budget || 1, 
      });
    } else {
      setFormData(initialMaterialState);
    }
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const backendData = {
      id_budget: formData.id_budget,
      id_type: formData.tipo, 
      id_category: formData.categoria,
      code: formData.codigo,
      name: formData.nome,
      unitMeasure: formData.unidade,
      stockQuantity: formData.qtde,
      allocatedStage: formData.etapa,
      weightLength: formData.massa, 
      recentInflow: formData.entrada_rec,
      cumulativeInflow: formData.entrada_acu,
      recentOutflow: formData.saida_rec,
      cumulativeOutflow: formData.saida_acu,
      actualQuantity: formData.atual,
      minQuantity: formData.minima,
    };
    
    //método e o endpoint
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode 
      ? `http://localhost:8080/stock/stockUpdate/${formData.id_stock}`
      : `http://localhost:8080/stock/stockCreate`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        // tenta ler a mensagem de erro do backend
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      onSave();
    } catch (err: any) {
      console.error("Erro ao salvar material:", err.message);
      setError(`Falha ao salvar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

 
  return (
    <div className="fixed inset-0 bg-[#607D8A] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{modalTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Erro:</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            
            <div className="col-span-3 border-b pb-2 mb-2">
                <h3 className="text-lg font-medium text-gray-700">Informações Principais</h3>
            </div>
            <FormInput label="Código" name="codigo" value={formData.codigo} onChange={handleChange} required />
            <FormInput label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
            <FormInput label="Unidade de Medida" name="unidade" value={formData.unidade} onChange={handleChange} required />
            <FormInput label="Tipo (id_type)" name="tipo" value={formData.tipo} onChange={handleChange} required />
            <FormInput label="Categoria (id_category)" name="categoria" value={formData.categoria} onChange={handleChange} required />
            <FormInput label="Etapa (allocatedStage)" name="etapa" value={formData.etapa} onChange={handleChange} />
            
            <div className="col-span-3 border-b pb-2 mt-4 mb-2">
                <h3 className="text-lg font-medium text-gray-700">Quantidades e Medidas</h3>
            </div>
            <FormInput label="Qtd. em Estoque (stockQuantity)" name="qtde" value={formData.qtde} onChange={handleChange} type="number" required />
            <FormInput label="Qtd. Atual (actualQuantity)" name="atual" value={formData.atual} onChange={handleChange} type="number" required />
            <FormInput label="Qtd. Mínima (minQuantity)" name="minima" value={formData.minima} onChange={handleChange} type="number" required />
            <FormInput label="Massa/Comp. (weightLength)" name="massa" value={formData.massa} onChange={handleChange} type="number" />
          </div>
          
          <div className="flex justify-end pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#607D8A] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#455a64] transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                    <FiSave className="animate-spin mr-2" /> Salvando...
                </>
              ) : (
                <>
                    <FiSave className="mr-2" /> Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FormInput = ({ label, name, value, onChange, type = "text", required = false }: any) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#607D8B] focus:border-transparent transition duration-150"
        />
    </div>
);