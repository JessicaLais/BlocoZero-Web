import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm";
import { Button } from "../../../auth/components/Button";
import incluirSvg from "../../../../assets/incluir.svg";
import editarSvg from "../../../../assets/editar.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface CategoryData {
  id: number;
  name: string;
  id_type: number;
}

interface TypeData {
  id: number;
  name: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  id_type: z.coerce.number().int().positive("O ID do tipo deve ser válido"),
});

export function CategoriasPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [types, setTypes] = useState<TypeData[]>([]); // << ADICIONADO
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    id_type: "1",
  });

  const resetForm = () => {
    setFormData({ name: "", id_type: "1" });
  };

  // ------------------ BUSCAR TIPOS ------------------
  const fetchTypes = async () => {
    try {
      const response = await api.get(`/type/list/${formData.id_type}`);
      setTypes(response.data.types || []);
    } catch (error) {
      console.error("Erro ao buscar tipos:", error);
    }
  };

  // ---------------- BUSCAR CATEGORIAS ----------------
  const fetchCategories = async () => {
    try {
      const response = await api.get(`/category/list/${formData.id_type}`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar categorias + tipos ao iniciar
  useEffect(() => {
    fetchCategories();
    fetchTypes(); // << ADICIONADO
  }, []);

  // Função para buscar o nome do tipo corretamente
  const getTypeName = (id: number) => {
    return types.find((t) => t.id === id)?.name || "—";
  };

  const handleNewClick = () => {
    resetForm();
    setSelectedId(null);
    setIsVisible(true);
  };

  const handleEditClick = () => {
    if (!selectedId) {
      return alert("Por favor, selecione uma categoria na tabela para editar.");
    }

    const catToEdit = categories.find((c) => c.id === selectedId);

    if (catToEdit) {
      setFormData({
        name: catToEdit.name,
        id_type: String(catToEdit.id_type),
      });
      setIsVisible(true);
    } else {
      console.error("Categoria não encontrada na lista.");
      setSelectedId(null);
      alert("Erro: categoria não encontrada.");
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedId) {
      return alert("Selecione uma categoria para excluir.");
    }

    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      setLoading(true);
      await api.delete(`/category/delete/${selectedId}`);
      alert("Categoria excluída com sucesso!");
      setSelectedId(null);
      setIsVisible(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir categoria.");
    } finally {
      setLoading(false);
    }
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);

      const data = categorySchema.parse({
        name: formData.name,
        id_type: formData.id_type,
      });

      if (selectedId) {
        await api.put(`/category/update/${selectedId}`, data);
        alert("Categoria atualizada com sucesso!");
      } else {
        await api.post("/category/register", data);
        alert("Categoria cadastrada com sucesso!");
      }

      setIsVisible(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      if (error instanceof ZodError) {
        return alert(error.issues[0].message);
      }
      if (error instanceof AxiosError) {
        return alert(error.response?.data.error || "Erro na requisição");
      }
      alert("Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-y-scroll h-[300px]">

      {/* FORM */}
      {isVisible && (
        <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            {selectedId ? "Editar Categoria" : "Nova Categoria"}
          </h3>

          <div className="flex flex-row items-center gap-6">
            <InputForm
              legend="Nome da Categoria:"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
              containerClassName="w-2/3"
            />

            <InputForm
              legend="ID Tipo:"
              value={formData.id_type}
              onChange={handleInputChange}
              name="id_type"
              type="number"
              containerClassName="w-1/3"
            />
          </div>

          <div className="flex gap-2 mt-2 justify-end">
            <Button
              className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 border border-gray-400"
              onClick={handleSubmit}
              isLoading={loading}
            >
              {selectedId ? "Salvar Alterações" : "Confirmar"}
            </Button>

            <Button
              className="px-4 h-[26px] text-sm bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
              onClick={() => { setIsVisible(false); resetForm(); }}
              type="button"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* BOTÕES */}
      <div className="flex justify-end mt-4 mb-2 gap-2">
        <Button
          className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"
          onClick={handleNewClick}
        >
          <img src={incluirSvg} alt="Incluir" className="w-4 h-4" />
          Incluir
        </Button>

        <Button
          onClick={handleEditClick}
          className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          disabled={!selectedId}
        >
          <img src={editarSvg} alt="Editar" className="w-4 h-4" />
          Editar
        </Button>

        <Button
          onClick={handleDeleteClick}
          className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-300" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          disabled={!selectedId}
        >
          <img src={deletarSvg} alt="Excluir" className="w-4 h-4" />
          Excluir
        </Button>
      </div>

      {/* TABELA */}
      <table className="bg-white border-1 border-gray-500 w-full text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-2 border-1">Categoria</th>
            <th className="px-2 border-1 w-32">Tipo</th>
          </tr>
        </thead>

        <tbody>
          {loading && categories.length === 0 ? (
            <tr><td colSpan={3} className="p-4 text-center">Carregando...</td></tr>
          ) : categories.length === 0 ? (
            <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhuma categoria cadastrada.</td></tr>
          ) : (
            categories.map((category) => (
              <tr
                key={category.id}
                onClick={() => {
                  if (selectedId === category.id) {
                    setSelectedId(null);
                    setIsVisible(false);
                    resetForm();
                  } else {
                    setSelectedId(category.id);
                    setIsVisible(false);
                    resetForm();
                  }
                }}
                className={`text-sm border-b-1 border-gray-500 cursor-pointer hover:bg-gray-50 ${
                  selectedId === category.id ? "bg-blue-200" : ""
                }`}
              >
                <td className="px-2 border-1 font-medium">{category.name}</td>

                {/* <<< AQUI TROCAMOS O ID PELO NOME DO TIPO >>> */}
                <td className="px-2 border-1">{getTypeName(category.id_type)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
