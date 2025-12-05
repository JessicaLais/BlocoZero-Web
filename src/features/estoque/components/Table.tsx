import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface itemsInsumo {
    id_stock: number;      
    code: string;
    name: string;
    id_type: number;       
    actualQuantity: number; 
    unitMeasure: string;   
}

export function Table() {
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

    if (loading) {
        return <p className="p-4">Carregando dados...</p>;
    }

    if (insumos.length === 0) {
        return <p className="p-4">Nenhum insumo encontrado para esta obra.</p>;
    }

    return (
        <table className="bg-white border-1 border-gray-500 w-full text-left">
            <thead> 
                <tr className="bg-gray-300">
                    <th className="px-1 border-1">Código</th>
                    <th className="px-1 border-1">Nome</th>
                    {/* Removi a coluna de Tipo (ID) para não mostrar números soltos */}
                    <th className="px-1 border-1">Qtd. Atual</th>
                    <th className="px-1 border-1">Unidade</th>
                </tr>
            </thead>
            <tbody>
                {insumos.map((insumo) => (
                    // O ID fica APENAS aqui no 'key' pro React não se perder
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