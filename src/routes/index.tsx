import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth.tsx";
import { AppLayout } from "../shared/AppLayout";

import { AuthRoutes } from "./AuthRoutes.tsx"; 
import { Home } from "../pages/HomePage";
import { CardObra } from "../pages/CardObra";
import { EstoqueList } from "../pages/EstoqueList";
import { EstoqueObra } from "../pages/Estoque";
import { CadastroObra } from "../pages/CadastroObra";
import { Orçamento } from "../pages/Orçamento";
import { Fin } from "../pages/Financeiro";
import EstoqueTab from "../pages/EstoqueTabela";
import { CronogramaPage } from "../pages/CronogramaFisico";

import { Relatorios } from "../pages/Relatorios";

function AppRoutes() {
    const { session } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                
                {session?.userFunction === "manager" && (
                    <>
                        <Route path="/cadastro-obra" element={<CadastroObra />} />
                        <Route path="/" element={<Navigate to="/cadastro-obra" />} />
                        <Route path="/orçamento" element={<Orçamento />} />
                        <Route path="/financeiro" element={<Fin />} />
                        <Route path="/tabela-estoque" element={<EstoqueTab />} />
                        <Route path="/cronograma-fisico" element={<CronogramaPage />} />
                    </>
                )}
                {session?.userFunction === "tender" && (
                    <>
                        <Route path="/work" element={<Home />} />
                        <Route path="/work/specific/:id" element={<CardObra />} />
                        <Route path="/estoque" element={<EstoqueList />} />
                        <Route path="/estoque/:work_id" element={<EstoqueObra />} />
                        <Route path="/" element={<Navigate to="/work" />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                     </>
                )}

                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    );
}

export function AppRouter() { 
    const { session, isLoading } = useAuth();
    console.log("ESTADO DO ROUTER:", { session, isLoading });
    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <BrowserRouter>
            {!session ? <AuthRoutes /> : <AppRoutes />}
        </BrowserRouter>
    );
}