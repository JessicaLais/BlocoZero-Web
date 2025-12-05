import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../../../../shared/ListaSelecaoObra";// Certifique-se que o caminho está correto

export function EstoqueSelecao() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden">
            <ListaSelecaoObra 
                title="Estoque das Obras"
                onSelect={(id) => navigate(`/obra/${id}/estoque`)}
            />
        </div>
    );
}