import { Routes, Route } from "react-router";
import { AppLayout } from "../shared/AppLayout";
import { CardObra } from "../pages/CardObra";
import { Home } from "../pages/HomePage";
export function HomePage() {
    return(
        <Routes>
            <Route path="/work" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="specific/:id" element={<CardObra />} />
            </Route>
        </Routes>
    )
}