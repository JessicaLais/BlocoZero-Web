import { SessionItem } from "../features/home/components/Session";
import searchSvg from "../assets/search.svg"; 
import { Input } from "../features/home/components/Input"
import { Button } from "../features/home/components/Button";
import { useEffect, useState } from "react";
interface Obra {
    id: string;
    title: string;
    enterprise: string;
    photo_url: string;
    start_date: string;
    end_date: string;
}
export function EstoqueList(){
    const [/*name*/, setName] = useState("")
    const [works, setWorks] = useState<Obra[]>([])

    function fetchRefunds(e: React.FormEvent) {
        e.preventDefault();
        
    }
        useEffect(() => {
           const getWorks = async () => {
            const response = await fetch(`http://localhost:8080/work/list`);
            const data = await response.json();
            setWorks(data);
           }
          getWorks();
        },[]
    )
    return (
        <div className="flex justify-center p-15 overflow-hidden">
            <main className="bg-white rounded-xl p-10 w-[768px] flex flex-col">
                
                    <h1 className="text-gray-100 font-bold text-xl flex-1">Estoque das Obras responsáveis</h1>
                    <form onSubmit={fetchRefunds} className="flex flex-1 block items-center justify-between mb-4 pb-6 border-b-[1px] border-b-gray-400 md:flex-row gap-2 mt-6 ">
                        <Input onChange={(e) => setName(e.target.value)} placeholder="Pesquisar"/>
                        <Button variant="icon" type="submit">
                            <img src={searchSvg} alt="Ícone de pesquisar" 
                            className="w-5"/>
                        </Button>
                    </form>
                      <div className="flex flex-col gap-4 max-h-[342px] overflow-y-scroll">
                        {works.map((work) => (
                                <SessionItem key={work.id} data={work} href={`/estoque/${work.id}`}/>
                            ))}
                        
                        </div>  
                
            </main>
        </div>
    )
}