import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface itemsInsumo {
    id: number;
    enterprise_id: number;
    work_id: number;
    code: string;
    name: string;
    type: string;
    quantity: number;
    unit: string;
    lote: string;
    createdAt: string;
    updatedAt: string;
}


export function Table() {
    const [insumos, setInsumos] = useState<itemsInsumo[]>([]);
    const [loading, setLoading] = useState(true);
    const { work_id } = useParams(); 

    useEffect(() => {
        const getInsumos = async () => {
            try {
                if (work_id) {
                    const response = await fetch(`http://localhost:8080/items/list/${work_id}`);
                    const data = await response.json();
                    console.log(data);
                    setInsumos(data.itemsByWorkId);
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
        return <p>Carregando dados...</p>;
    }

    if (insumos.length === 0) {
        return <p>Nenhum insumo encontrado.</p>;
    }

    return (
        <table className="bg-white border-1 border-gray-500 w-full text-left ">
            <thead> 
                <tr className="bg-gray-300">
                    <th className="px-1 border-1">Código</th>
                    <th className="px-1 border-1">Nome</th>
                    <th className="px-1 border-1">Tipo</th>
                    <th className="px-1 border-1">Quantidade</th>
                    <th className="px-1 border-1">Unidades</th>
                    <th className="px-1 border-1">Lote</th>
                </tr>
            </thead>
            <tbody>
                {insumos.map((insumo) => (
                    <tr key={insumo.id} className="text-sm border-b-1 border-gray-500"> 
                        <td className="px-2 border-1">{insumo.code}</td>
                        <td className="px-2 border-1">{insumo.name}</td>
                        <td className="px-2 border-1">{insumo.type}</td>
                        <td className="px-2 border-1">{insumo.quantity}</td>
                        <td className="px-2 border-1">{insumo.unit}</td>
                        <td className="px-2 border-1">{insumo.lote}</td>
                    </tr>   
                ))}
            </tbody>
        </table>
    );
}