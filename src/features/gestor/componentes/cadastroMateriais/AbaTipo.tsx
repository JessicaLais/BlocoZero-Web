import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm"; 
import { Button } from "../../../auth/components/Button"; 
import incluirSvg from "../../../../assets/incluir.svg"; 
import editarSvg from "../../../../assets/editar.svg"; 
import deletarSvg from "../../../../assets/deletar.svg"; 
import { api } from "../../../../services/api"; 

interface TypeData {
  id: number;
  name: string;
  work_id: number;
}

const typeSchema = z.object({
  name: z.string().min(1, "O nome do tipo é obrigatório"),
  work_id: z.coerce.number().int().positive("O ID da obra deve ser válido"),
});

export function TiposPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [types, setTypes] = useState<TypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    work_id: "1", 
  });

  // funcao para buscar a lista de Tipos
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

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(type: TypeData) {
    setFormData({
        name: type.name,
        work_id: String(type.work_id),
    });
    setEditingId(type.id);
    setIsVisible(true);
}

  function handleCancel() {
    setIsVisible(false);
    setEditingId(null);
    setFormData({ name: "", work_id: "1" });
  }

  // funcao para deletar
  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este tipo?")) return;

    try {
        await api.delete(`/type/delete/${id}`);
        alert("Tipo excluído com sucesso!");
        fetchTypes(); 
    } catch (error) {
        alert("Erro ao excluir o tipo.");
        console.error(error);
    }
}

  // funcao de submit para criar e atualizar
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      
      const data = typeSchema.parse({
        name: formData.name,
        work_id: formData.work_id,
      });

      if (editingId) {
        await api.put(`/type/update/${editingId}`, data);
        alert("Tipo atualizado com sucesso!");
      } else {
        await api.post("/type/register", data);
        alert("Tipo cadastrado com sucesso!");
      }

      handleCancel(); 
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

  return (
    <div className="overflow-y-scroll h-[300px]">
      
      {isVisible && (
        <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            {editingId ? "Editar Tipo" : "Novo Tipo"}
          </h3>
          <div className="flex flex-row items-center gap-6">
            <InputForm
              legend="Nome do Tipo:"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
              containerClassName="w-2/3"
            />
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
            <Button
              className="px-4 h-[26px] text-sm bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
              onClick={handleCancel}
              type="button"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {!isVisible && (
        <div className="flex justify-end mb-4">
          <Button
            className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"
            onClick={() => setIsVisible(true)}
          >
            <img src={incluirSvg} alt="Incluir" className="w-4 h-4" />
            Incluir Tipo
          </Button>
        </div>
      )}


      {loading && !isVisible ? (
        <p>Carregando dados...</p>
      ) : (
        <table className="bg-white border-1 border-gray-500 w-full text-left">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-2 border-1">ID</th>
              <th className="px-2 border-1">Nome do Tipo</th>
              <th className="px-2 border-1">ID Obra</th>
              <th className="px-2 border-1 text-center">Ações</th>
            </tr>
          </thead>
      <tbody>
    {types.length === 0 ? (
      <tr>
        <td colSpan={4} className="p-2 text-center text-gray-500">
          Nenhum tipo cadastrado.
        </td>
      </tr>
    ) : (
      types.map((type) => (
        <tr key={type.id} className="text-sm border-b-1 border-gray-500 hover:bg-gray-50">
          <td className="px-2 border-1">{type.id}</td>
          <td className="px-2 border-1">{type.name}</td>
          <td className="px-2 border-1">{type.work_id}</td>
          <td className="px-2 border-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => handleEdit(type)}
                title="Editar"
                className="p-1 hover:bg-gray-200 rounded"
              >
                <img src={editarSvg} alt="Editar" className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(type.id)}
                title="Excluir"
                className="p-1 hover:bg-red-100 rounded"
              >
                <img src={deletarSvg} alt="Deletar" className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
      )}
    </div>
  );
}