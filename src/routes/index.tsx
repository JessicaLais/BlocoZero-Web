import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./AuthRoutes.tsx";
import { HomePage } from "./HomePage.tsx";
import { EstoqueRoute } from "./Estoque.tsx";
import { CadastroObraRoutes } from "./CadastroObra.tsx";

const session = {
    user: {
        role: "tender"
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
                return <CadastroObraRoutes/>
                
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