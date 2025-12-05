import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../../../../shared/ListaSelecaoObra";// Certifique-se que o caminho está correto

export function CronogramaSelecao() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden">
            <ListaSelecaoObra 
                title="Cronogramas das Obra"
                onSelect={(id) => navigate(`/obra/${id}/cronograma`)}
            />
        </div>
    );
}