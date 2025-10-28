import { Routes, Route } from "react-router";
import { CadastroObra } from "../pages/CadastroObra";
import { AppLayout } from "../shared/AppLayout";

export function CadastroObraRoutes(){
    return(
        <Routes>
            <Route path="/cadastro-obra" element={<AppLayout />} >
                <Route path="/cadastro-obra" element={<CadastroObra />} />
            </Route>
        </Routes>
    )
}