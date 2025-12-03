import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm"; 
import { Button } from "../../../auth/components/Button"; 
// Importando os ícones
import incluirSvg from "../../../../assets/incluir.svg"; 
import editarSvg from "../../../../assets/editar.svg"; 
import deletarSvg from "../../../../assets/deletar.svg"; 
import { api } from "../../../../services/api"; 

// Interface dos dados
interface TypeData {
  id: number;
  name: string;
  work_id: number;
}

// Validação
const typeSchema = z.object({
  name: z.string().min(1, "O nome do tipo é obrigatório"),
  work_id: z.coerce.number().int().positive("O ID da obra deve ser válido"),
});

export function TiposPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [types, setTypes] = useState<TypeData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar a linha selecionada (Igual ao FuncionariosPanel)
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    work_id: "1", 
  });

  const resetForm = () => {
    setFormData({ name: "", work_id: "1" });
  };

  // --- BUSCA DE DADOS ---
  const fetchTypes = async () => {
    try {
      const response = await api.get(`/type/list/${formData.work_id}`);
      setTypes(response.data.types || []);
    } catch (error) {
      console.error("Erro ao buscar tipos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // --- HANDLERS DE BOTÕES (Igual FuncionariosPanel) ---

  const handleNewClick = () => {
    resetForm();
    setSelectedId(null); // Limpa seleção ao criar novo
    setIsVisible(true);
  };

  const handleEditClick = () => {
    if (!selectedId) {
        return alert("Por favor, selecione um tipo na tabela para editar.");
    }

    const typeToEdit = types.find((t) => t.id === selectedId);
    if (typeToEdit) {
      setFormData({
        name: typeToEdit.name,
        work_id: String(typeToEdit.work_id),
      });
      setIsVisible(true);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedId) {
        return alert("Por favor, selecione um tipo na tabela para excluir.");
    }

    if (!confirm("Tem certeza que deseja excluir este tipo?")) return;

    try {
      setLoading(true);
      await api.delete(`/type/delete/${selectedId}`);
      
      alert("Tipo excluído com sucesso!");
      
      setSelectedId(null);
      setIsVisible(false);
      resetForm();
      fetchTypes(); 
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
         return alert(error.response?.data.error || "Erro ao excluir tipo.");
      }
      alert("Erro ao excluir o tipo.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORMULÁRIO ---

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      
      const data = typeSchema.parse({
        name: formData.name,
        work_id: formData.work_id,
      });

      if (selectedId) {
        await api.put(`/type/update/${selectedId}`, data);
        alert("Tipo atualizado com sucesso!");
      } else {
        await api.post("/type/register", data);
        alert("Tipo cadastrado com sucesso!");
      }

      setIsVisible(false);
      resetForm();
      fetchTypes();   
    } catch (error) {
      if (error instanceof ZodError) {
        return alert(error.issues[0].message);
      }
      if (error instanceof AxiosError) {
        return alert(error.response?.data.error || "Erro na requisição");
      }
      alert("Não foi possível realizar a solicitação");
    } finally {
      setLoading(false);
    }
  }

  // --- RENDERIZAÇÃO ---

  if (loading && types.length === 0) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="overflow-y-scroll h-[300px]">
      
      {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
      {isVisible && (
        <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
          <div className="flex flex-row items-center gap-6">
            <InputForm
              legend="Nome do Tipo:"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
              containerClassName="w-2/3"
            />
            {/* O ID da obra pode ficar oculto ou visível dependendo da regra, mantive visível para debug */}
            <InputForm
              legend="ID Obra:"
              value={formData.work_id}
              onChange={handleInputChange}
              name="work_id"
              type="number"
              containerClassName="w-1/3"
            />
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button
              className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 border border-gray-400"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Confirmar
            </Button>
            {/* Botão Cancelar fecha o formulário */}
            <Button
                className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 border border-gray-400"
                onClick={() => { setIsVisible(false); resetForm(); }}
                type="button"
            >
                Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* BARRA DE BOTÕES SUPERIOR (PADRONIZADA) */}
      <div className="flex justify-end mt-4 mb-2 gap-2">
        <Button 
            className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400" 
            onClick={handleNewClick}
        >
            <img src={incluirSvg} alt="Incluir" />
            Incluir
        </Button>
        
        <Button 
            onClick={handleEditClick}
            // Lógica idêntica ao FuncionariosPanel: Azul se selecionado, Amarelo Opaco se não.
            className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-yellow-350 text-black hover:bg-gray-300 opacity-50'}`}
        >
            <img src={editarSvg} alt="Editar" />
            Editar
        </Button>
        
        <Button 
            onClick={handleDeleteClick}
            // Lógica idêntica: Vermelho se selecionado, Cinza Opaco se não.
            className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-gray-350 text-black hover:bg-gray-300 opacity-50'}`}
        >
            <img src={deletarSvg} alt="Excluir" />
            Excluir
        </Button>
      </div>

      {/* TABELA DE DADOS */}
      <table className="bg-white border-1 border-gray-500 w-full text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-2 border-1 w-24">ID</th>
            <th className="px-2 border-1">Nome do Tipo</th>
            <th className="px-2 border-1 w-32">ID Obra</th>
          </tr>
        </thead>
        <tbody>
          {types.length === 0 ? (
             <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhum tipo cadastrado.</td></tr>
          ) : (
            types.map((type) => (
              <tr 
                key={type.id} 
                onClick={() => {
                    // Lógica de Toggle: Clica seleciona, clica de novo desmarca
                    if (selectedId === type.id) {
                        setSelectedId(null);
                        setIsVisible(false);
                        resetForm();
                    } else {
                        setSelectedId(type.id);
                        setIsVisible(false); // Fecha form ao trocar de linha para evitar conflito
                        resetForm();
                    }
                }}
                // Estilo condicional: Azul se selecionado, Cinza no Hover
                className={`text-sm border-b-1 border-gray-500 cursor-pointer hover:bg-gray-200 ${selectedId === type.id ? 'bg-blue-200' : ''}`}
              >
                <td className="px-2 border-1">{type.id}</td>
                <td className="px-2 border-1">{type.name}</td>
                <td className="px-2 border-1">{type.work_id}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
    </div>
  );
}