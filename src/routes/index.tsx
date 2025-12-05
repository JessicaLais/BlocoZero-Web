
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth.tsx";
import { AppLayout } from "../shared/AppLayout";

import { AuthRoutes } from "./AuthRoutes.tsx"; 
import { Home } from "../pages/HomePage";
import { CardObra } from "../pages/CardObra";
import { EstoqueList } from "../pages/EstoqueList";
import { EstoqueObra } from "../pages/Estoque";
import { CronogramaSelecao } from "../features/gestor/componentes/cronograma/CronogramaList.tsx";
import { OrcamentoSelecao } from "../features/gestor/componentes/orçamento/OrcamentoSelecao.tsx";
import { EstoqueSelecao } from "../features/gestor/componentes/estoque-tabela/EstoqueSelecao.tsx";
import { FinanceiroSelecao } from "../features/financeiro/FinanceiroSelecao.tsx";
import { CadastroObra } from "../pages/CadastroObra";
import { Orçamento } from "../pages/Orçamento";
import { Fin } from "../pages/Financeiro";
import EstoqueTab from "../pages/EstoqueTabela";
import { CronogramaPage } from "../pages/CronogramaFisico";
import { GerenciarObra } from "../features/gestor/componentes/cadastroMateriais/GerenciarObra.tsx";
import { Relatorios } from "../pages/Relatorios";
function AppRoutes() {
    const { session } = useAuth();


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
                        <Route path="/orcamento" element={<OrcamentoSelecao />} />
                        <Route path="/financeiro" element={<FinanceiroSelecao/>} />
                        <Route path="/tabela-estoque" element={<EstoqueSelecao />} />
                        <Route path="/cronograma-fisico" element={<CronogramaSelecao />} />
                        {/* Rota Inicial do Manager */}
                        <Route path="/" element={<Navigate to="/cadastro-obra" />} />
                    </>
                )}

                {/* --- ROTAS DO TENDER (Encarregado) --- */}
                {session?.userFunction === "tender" && (
                    <>

                        <Route path="/obra/:work_id/cronograma" element={<CronogramaPage />} />

                        <Route path="/work" element={<Home />} />
                        <Route path="/work/specific/:id" element={<CardObra />} />
                        <Route path="/estoque" element={<EstoqueList />} />
                        <Route path="/estoque/:work_id" element={<EstoqueObra />} />
                        <Route path="/" element={<Navigate to="/work" />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                        <Route path="/cronograma-fisico" element={<CronogramaSelecao />} />
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