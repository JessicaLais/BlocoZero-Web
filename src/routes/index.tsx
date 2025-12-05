
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
import { GerenciarObra } from "../features/gestor/componentes/cadastroMateriais/GerenciarObra.tsx";

import { Relatorios } from "../pages/Relatorios";

function AppRoutes() {
    const { session } = useAuth();

    // Defina um ID padrão para testes quando clicar na Sidebar (ex: Obra 1)
    const DEFAULT_WORK_ID = 1;

    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                
                {/* --- ROTAS DO MANAGER (Gestor) --- */}
                {session?.userFunction === "manager" && (
                    <>
                        {/* 1. Rotas Principais */}
                        <Route path="/cadastro-obra" element={<CadastroObra />} />
                        <Route path="/obras/:id" element={<GerenciarObra />} />

                        {/* 2. Rotas Dinâmicas (Que esperam ID da Obra) */}
                        <Route path="/obra/:work_id/orcamento" element={<Orçamento />} />
                        <Route path="/obra/:work_id/financeiro" element={<Fin />} />
                        <Route path="/obra/:work_id/estoque" element={<EstoqueTab />} />
                        <Route path="/obra/:work_id/cronograma" element={<CronogramaPage />} />

                        {/* 3. GAMBIARRA DE NAVEGAÇÃO (Sidebar Fixa -> Rota Dinâmica) */}
                        {/* Isso faz os links da sua Sidebar atual funcionarem redirecionando para a Obra 1 */}
                        <Route path="/orçamento" element={<Navigate to={`/obra/${DEFAULT_WORK_ID}/orcamento`} replace />} />
                        <Route path="/financeiro" element={<Navigate to={`/obra/${DEFAULT_WORK_ID}/financeiro`} replace />} />
                        <Route path="/tabela-estoque" element={<Navigate to={`/obra/${DEFAULT_WORK_ID}/estoque`} replace />} />
                        <Route path="/cronograma-fisico" element={<Navigate to={`/obra/${DEFAULT_WORK_ID}/cronograma`} replace />} />

                        {/* Rota Inicial do Manager */}
                        <Route path="/" element={<Navigate to="/cadastro-obra" />} />
                    </>
                )}

                {/* --- ROTAS DO TENDER (Encarregado) --- */}
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

                {/* Fallback para rota não encontrada */}
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    );
}

export function AppRouter() { 
    const { session, isLoading } = useAuth();
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return (
        <BrowserRouter>
            {!session ? <AuthRoutes /> : <AppRoutes />}
        </BrowserRouter>
    );
}