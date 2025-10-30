import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./AuthRoutes.tsx";
import { HomePage } from "./HomePage.tsx";
import { EstoqueRoute } from "./Estoque.tsx";
import { CadastroObraRoutes } from "./CadastroObra.tsx";
import { EstoqueTabelaRoute } from "./EstoqueTabela.tsx";

const session = {
    user: {
        role: "manager"
    }
}
export function Routes(){
    function Route(){
        switch(session?.user.role){
            case "tender":
                return (
                    <div>
                        <HomePage/>
                        <EstoqueRoute/>
                    </div>
            )
            
            case "manager":
                return (
                    <>
                        <CadastroObraRoutes/>
                        <EstoqueTabelaRoute/>
                    </>
                )
            case "":
                return <AuthRoutes />
               
        }
    }
    return(
        <BrowserRouter>
            <Route />
        </BrowserRouter>
    )
}