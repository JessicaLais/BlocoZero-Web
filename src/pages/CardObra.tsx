import { Cards } from "../features/home/components/Cards"
import { ContentBox } from "../features/home/components/ContentBox"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

export function CardObra(){
    const { id } = useParams(); 
    const [work, setWork] = useState(null); 

    useEffect(() => {
       if (!id) return;
       const getWork = async () => {
         try {
             const response = await fetch(`http://localhost:8080/work/specific/${id}`);
             const data = await response.json();
             const workData = data.getSpecificWork
             setWork(workData); 
             console.log(data); 

         } catch(error) {
             console.error("Erro ao buscar obra:", error);
             alert("Erro ao buscar obra");
         }
       }
       getWork();
    }, [id]);

    if (!work) {
        return <div>Carregando detalhes da obra...</div>;
    }

    return (
        <div className="w-full flex flex-col items-center justify-center bg-white-100 p-4">
            <ContentBox data={work} />
            <Cards data={work} />
        </div>
    )
}