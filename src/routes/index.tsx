import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./AuthRoutes.tsx";
import { HomePage } from "./HomePage.tsx";
import { EstoqueRoute } from "./Estoque.tsx";
export function Routes(){
    return(
        <BrowserRouter>
            <AuthRoutes />
            <HomePage />
            <EstoqueRoute />
        </BrowserRouter>
    )
}