import { Cards } from "../features/home/components/Cards"
import { ContentBox } from "../features/home/components/ContentBox"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

export function CardObra(){
    const {id} = useParams()
    const [work, setwork] = useState({})
    useEffect(() => {
       const getwork = async () => {
        try {
            const response = await fetch(`http://localhost:8080/work/${id}`);
            const data = await response.json();
            setwork(data);
            console.log(data)
        }catch(error){
            alert("Erro ao buscar obra")
        }
       }
       getwork();
    },[]
)
    return (
        <div className="w-full flex flex-col items-center justify-center bg-white-100 p-4">
            <ContentBox  data={work}/> {/*Está reclamando pq não passei todas as propriedades que vem do backend no meu componente */}
            <Cards data={work}/>
        </div>
    )
}