import { useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "./Tabs";
import { MateriaisPanel } from "./AbaMateriais";
import { FuncionariosPanel } from "./AbaFuncionarios";
import { CronogramaPanel } from "./AbaEtapa"; // Mantive seu nome de arquivo original
import { SubetapasPanel } from "./AbaSubetapas";
// --- Novos imports vindos do Git Pull ---
import { TiposPanel } from "./AbaTipo"; 
import { CategoriasPanel } from "./AbaCategoria";

export function AbasCadastroObra() {
    // Controla qual aba está ativa visualmente
    const [activeTab, setActiveTab] = useState("materiais");
    
    // Guarda qual Etapa foi selecionada para visualizarmos as subetapas
    const [selectedStage, setSelectedStage] = useState<{id: number, name: string} | null>(null);

    // Função chamada pela AbaCronograma quando o usuário clica em "Ver Subetapas"
    const handleSelectStage = (id: number, name: string) => {
        setSelectedStage({ id, name });
        setActiveTab("subetapas"); // Troca de aba automaticamente
    };

    return (
        <div className="w-full p-4">
            {/* Passamos activeTab e onChange para controlar as abas via código */}
            <Tabs defaultTab="materiais" activeTab={activeTab} onChange={setActiveTab}>
                <TabList>
                    <div className="flex justify-between w-full">
                        <div>
                            <Tab label="materiais">Materiais</Tab>
                            <Tab label="funcionarios">Funcionários</Tab>
                            <Tab label="cronograma">Etapas</Tab>
                            
                            {/* --- Abas novas do Git Pull --- */}
                            <Tab label="tipos">Tipos</Tab>
                            <Tab label="categorias">Categorias</Tab>
                            
                            {/* Aba Subetapas (Sua implementação) */}
                            <Tab label="subetapas" disabled={!selectedStage}>
                                {selectedStage ? `Subetapas de: ${selectedStage.name}` : "Subetapas"}
                            </Tab>
                        </div>
                    </div>
                </TabList>

                <TabPanels>
                    <TabPanel whenActive="materiais">
                        <MateriaisPanel />
                    </TabPanel>
                    
                    <TabPanel whenActive="funcionarios">
                        <FuncionariosPanel />
                    </TabPanel>
                    
                    <TabPanel whenActive="cronograma">
                        {/* Passamos a função de seleção para dentro do painel */}
                        <CronogramaPanel onSelectStage={handleSelectStage} />
                    </TabPanel>

                    {/* --- Painéis novos do Git Pull --- */}
                    <TabPanel whenActive="tipos">
                        <TiposPanel />
                    </TabPanel>

                    <TabPanel whenActive="categorias">
                        <CategoriasPanel />
                    </TabPanel>

                    <TabPanel whenActive="subetapas">
                        <SubetapasPanel selectedStage={selectedStage} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}