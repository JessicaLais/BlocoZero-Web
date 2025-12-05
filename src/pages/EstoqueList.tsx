import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../shared/ListaSelecaoObra";

export function EstoqueList() {
    const navigate = useNavigate();

    return (
        // Um container simples para garantir o fundo cinza padrão do sistema
        <div className="h-screen bg-[#F5F5F5] overflow-hidden">
            <ListaSelecaoObra 
                title="Estoque das Obras Responsáveis"
                // Aqui definimos a rota específica do Estoque: /estoque/{id}
                onSelect={(id) => navigate(`/estoque/${id}`)}
            />
        </div>
    );
}