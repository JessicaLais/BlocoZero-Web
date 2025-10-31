import { BrowserRouter } from "react-router";
import { useAuth } from "../hooks/useAuth.tsx";
import { AuthRoutes } from "./AuthRoutes.tsx";
import { HomePage } from "./HomePage.tsx";
import { EstoqueRoute } from "./Estoque.tsx";
import { CadastroObraRoutes } from "./CadastroObra.tsx";

export function Routes(){
    const { session } = useAuth()
    function Route(){
        switch(session?.user.userFunction){
            case "tender":
                return (
                    <div>
                        <HomePage/>
                        <EstoqueRoute/>
                    </div>
            )
            case "manager":
                return <CadastroObraRoutes/>
                
            default:
                return <AuthRoutes />
        }
    }
    return(
        <BrowserRouter>
            <Route />
        </BrowserRouter>
    )
}

