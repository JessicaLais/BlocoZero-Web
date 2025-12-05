import { useState, useEffect } from "react";
import searchSvg from "../assets/search.svg"; 
import { Input } from "../features/home/components/Input"
import { Button } from "../features/home/components/Button";
import { SessionItem } from "../features/home/components/Session";
import { Pagination } from "../features/home/components/Pagination"; // Importação adicionada

interface Obra {
    id_work: string;
    title: string;
    photo: string;
    start_time: string;
    end_time: string;
}

export function EstoqueList() {
    const [/*name*/, setName] = useState("");
    const [works, setWorks] = useState<Obra[]>([]);
    
    const [page, setPage] = useState(1);
    const [totalOfPage, setTotalOfPage] = useState(1);

    function fetchRefunds(e: React.FormEvent) {
        e.preventDefault();
    }

    useEffect(() => {
        const getWorks = async () => {
            try {
                const response = await fetch(`http://localhost:8080/work/list/1/page/${page}`);
                const data = await response.json();
                
                console.log("RESPOSTA DA API (Estoque):", data); 

                // Lógica segura de setar os dados (igual à Home)
                if (data.works && Array.isArray(data.works)) {
                    setWorks(data.works);
                }

                // Lógica de cálculo de páginas (igual à Home)
                if (data.page) {
                    const pageInfo = data.page; 
                    const totalPagesString = pageInfo.split(' of ')[1]; 
                    setTotalOfPage(parseInt(totalPagesString, 10)); 
                }

            } catch (error) {
                console.error("Erro ao buscar estoque:", error);
            }
        }
        getWorks();
    }, [page]); // Atualiza quando a página muda

    function handlePagination(action: "next" | "previous") {
        setPage((prevPage) => {
            if (action === "next" && prevPage < totalOfPage) {
                return prevPage + 1;
            }
            if (action === "previous" && prevPage > 1) {
                return prevPage - 1;
            }
            return prevPage;
        })
    }
    
    return (
        <div className="flex justify-center p-10 overflow-hidden">
            <main className="bg-white rounded-xl p-10 w-[768px] flex flex-col">
                
                <h1 className="text-gray-100 font-bold text-xl flex-1">Estoque das Obras responsáveis</h1>
                
                <form onSubmit={fetchRefunds} className="flex flex-1 items-center justify-between mb-4 pb-6 border-b-[1px] border-b-gray-400 md:flex-row gap-2 mt-6 ">
                    <Input onChange={(e) => setName(e.target.value)} placeholder="Pesquisar"/>
                    <Button variant="icon" type="submit">
                        <img src={searchSvg} alt="Ícone de pesquisar" className="w-5"/>
                    </Button>
                </form>

                <div className="flex flex-col gap-4 max-h-[342px] overflow-y-scroll">
                    {works.map((work) => (
                        <SessionItem 
                            key={work.id_work} 
                            data={work} 
                            // Mantive o href diferente conforme sua solicitação anterior
                            href={`/estoque/${work.id_work}`}
                        />
                    ))}
                </div>  

                {/* Componente de Paginação Adicionado */}
                <div className="mt-4">
                    <Pagination 
                        current={page}
                        total={totalOfPage}
                        onNext={() => handlePagination("next")}
                        onPrevious={() => handlePagination("previous")}
                    />
                </div>
                
            </main>
        </div>
    )
}