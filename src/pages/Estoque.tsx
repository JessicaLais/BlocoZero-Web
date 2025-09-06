//import { Formulario } from "../features/estoque/components/Formulario"
import { FilterStatic } from "../features/estoque/components/Filter"
import { Table } from "../features/estoque/components/Table"
export function EstoqueObra(){
    return (
        <div className="bg-white h-screen p-10 flex flex-col ">
          {/*
              <Formulario />  

          */}
          <div>
            <a href="/estoque" className="font-semibold text-green-400 cursor-pointer">Voltar</a>
          </div>
            <FilterStatic />
            <Table />
            
        </div>
    )
}