import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { type FiltersState } from "./Filter";

interface itemsInsumo {
    id_stock: number;      
    code: string;
    name: string;
    id_type: number;       
    actualQuantity: number; 
    unitMeasure: string;   
}

// Adicionamos as props para receber os filtros
interface TableProps {
    filters: FiltersState;
}

export function Table({ filters }: TableProps) {
    const [insumos, setInsumos] = useState<itemsInsumo[]>([]);
    const [loading, setLoading] = useState(true);
    const { work_id } = useParams(); 

    useEffect(() => {
        const getInsumos = async () => {
            try {
                if (work_id) {
                    const response = await fetch(`http://localhost:8080/stock/${work_id}`);
                    const data = await response.json();
                    
                    if (data.stock_items && Array.isArray(data.stock_items)) {
                        setInsumos(data.stock_items);
                    } else {
                        setInsumos([]); 
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };
        getInsumos();
    }, [work_id]);

    // --- LÓGICA DE FILTRAGEM ---
    const filteredInsumos = insumos.filter((item) => {
        // 1. Filtro por Código (ignora maiúsculas/minúsculas)
        if (filters.code && !item.code.toLowerCase().includes(filters.code.toLowerCase())) {
            return false;
        }

        // 2. Filtro por Nome
        if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }

        // 3. Filtro por Tipo
        if (filters.type) {
            // ATENÇÃO: Aqui você precisa saber qual ID representa qual tipo no seu Banco de Dados.
            // Exemplo: Supondo que 1 = Material e 2 = Equipamento.
            // Se o seu banco usa outros números, altere abaixo!
            
            const tipoSelecionado = filters.type; // "Material" ou "Equipamento"
            
            if (tipoSelecionado === "Material" && item.id_type !== 1) return false;
            if (tipoSelecionado === "Equipamento" && item.id_type !== 2) return false;
        }

        return true;
    });

    if (loading) {
        return <p className="p-4">Carregando dados...</p>;
    }

    if (insumos.length === 0) {
        return <p className="p-4">Nenhum insumo encontrado para esta obra.</p>;
    }

    // Se tem insumos, mas o filtro escondeu todos
    if (filteredInsumos.length === 0) {
        return <p className="p-4 text-gray-500">Nenhum item corresponde aos filtros selecionados.</p>;
    }

    return (
        <table className="bg-white border-1 border-gray-500 w-full text-left">
            <thead> 
                <tr className="bg-gray-300">
                    <th className="px-1 border-1">Código</th>
                    <th className="px-1 border-1">Nome</th>
                    <th className="px-1 border-1">Qtd. Atual</th>
                    <th className="px-1 border-1">Unidade</th>
                </tr>
            </thead>
            <tbody>
                {/* Renderizamos a lista FILTRADA em vez da lista completa */}
                {filteredInsumos.map((insumo) => (
                    <tr key={insumo.id_stock} className="text-sm border-b-1 border-gray-500"> 
                        <td className="px-2 border-1">{insumo.code}</td>
                        <td className="px-2 border-1">{insumo.name}</td>
                        <td className="px-2 border-1">{insumo.actualQuantity}</td>
                        <td className="px-2 border-1">{insumo.unitMeasure}</td>
                    </tr>   
                ))}
            </tbody>
        </table>
    );
}