import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../../shared/ListaSelecaoObra";

export function FinanceiroSelecao() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden">
            <ListaSelecaoObra 
                title="Relatório das Obras"
                onSelect={(id) => navigate(`/obra/${id}/financeiro`)}
            />
        </div>
    );
}