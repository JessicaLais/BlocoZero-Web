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

const categorySchema = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  id_type: z.coerce.number().int().positive("O ID do tipo deve ser válido"),
});

export function CategoriasPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    id_type: "1", 
  });

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

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(category: CategoryData) {
    setFormData({
      name: category.name,
      id_type: String(category.id_type),
    });
    setEditingId(category.id);
    setIsVisible(true);
  }

  function handleCancel() {
    setIsVisible(false);
    setEditingId(null);
    setFormData({ name: "", id_type: "1" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await api.delete(`/category/delete/${id}`);
      alert("Categoria excluída com sucesso!");
      fetchCategories();
    } catch (error) {
      alert("Erro ao excluir a categoria.");
      console.error(error);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);

      const data = categorySchema.parse({
        name: formData.name,
        id_type: formData.id_type,
      });

      if (editingId) {
        await api.put(`/category/update/${editingId}`, { name: data.name });
        alert("Categoria atualizada com sucesso!");
      } else {
        await api.post("/category/register", data);
        alert("Categoria cadastrada com sucesso!");
      }

      handleCancel();
      fetchCategories();
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
      {/* Formulário */}
      {isVisible && (
        <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            {editingId ? "Editar Categoria" : "Nova Categoria"}
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

      {/* Botão Incluir */}
      {!isVisible && (
        <div className="flex justify-end mb-4">
          <Button
            className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"
            onClick={() => setIsVisible(true)}
          >
            <img src={incluirSvg} alt="Incluir" className="w-4 h-4" />
            Incluir Categoria
          </Button>
        </div>
      )}

      {/* Tabela */}
      {loading && !isVisible ? (
        <p>Carregando dados...</p>
      ) : (
        <table className="bg-white border-1 border-gray-500 w-full text-left">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-2 border-1">ID</th>
              <th className="px-2 border-1">Nome</th>
              <th className="px-2 border-1">ID Tipo</th>
              <th className="px-2 border-1 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-2 text-center text-gray-500">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="text-sm border-b-1 border-gray-500 hover:bg-gray-50"
                >
                  <td className="px-2 border-1">{category.id}</td>
                  <td className="px-2 border-1 font-medium">{category.name}</td>
                  <td className="px-2 border-1">{category.id_type}</td>
                  <td className="px-2 border-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        title="Editar"
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <img src={editarSvg} alt="Editar" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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