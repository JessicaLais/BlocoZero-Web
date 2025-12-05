import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../../../../shared/ListaSelecaoObra";// Certifique-se que o caminho está correto

export function OrcamentoSelecao() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden">
            <ListaSelecaoObra 
                title="Orçamento das Obras"
                onSelect={(id) => navigate(`/obra/${id}/orcamento`)}
            />
        </div>
    );
}