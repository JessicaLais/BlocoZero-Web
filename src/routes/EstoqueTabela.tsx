import EstoqueTabela from "../pages/EstoqueTabela";
import { Route, Routes } from "react-router";
import { AppLayout } from "../shared/AppLayout";

export function EstoqueTabelaRoute() {
    return (
        <Routes>
            <Route path="/tabela-estoque" element={<AppLayout />}>
                <Route index element={<EstoqueTabela />} />
            </Route>
        </Routes>
    );
}