import { Route, Routes } from "react-router";
import { EstoqueObra } from "../pages/Estoque";
import { AppLayout } from "../shared/AppLayout";
import { EstoqueList } from "../pages/EstoqueList";
export function EstoqueRoute(){
    return(
    <Routes>
        <Route path="/estoque" element={<AppLayout/>}>
            <Route path="/estoque" element={<EstoqueList />} />
            <Route path="/estoque/:work_id" element={<EstoqueObra />} />
        </Route>
    </Routes>
    )
}