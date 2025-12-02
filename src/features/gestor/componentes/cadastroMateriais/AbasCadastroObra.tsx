import { Tabs, TabList, Tab, TabPanels, TabPanel } from "./Tabs";
import { MateriaisPanel } from "./AbaMateriais";
import { FuncionariosPanel } from "./AbaFuncionarios";
import { CronogramaPanel } from "./AbaCronograma";
import { TiposPanel } from "./AbaTipo";
import { CategoriasPanel } from "./AbaCategoria";

export function AbasCadastroObra() {
    return (
        <div className="w-full p-4">
                <Tabs defaultTab="materiais">
                    <TabList>
                        <div className="flex justify-between w-full">

                            <div >
                                <Tab label="materiais">Materiais</Tab>
                                <Tab label="funcionarios">Funcionários</Tab>
                                <Tab label="cronograma">Cronograma inicial</Tab>
                                <Tab label="tipos">Tipos</Tab>
                                <Tab label="categorias">Categorias</Tab>
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
                            <CronogramaPanel />
                        </TabPanel>
                        <TabPanel whenActive="tipos">
                            <TiposPanel />
                        </TabPanel>
                        <TabPanel whenActive="categorias">
                            <CategoriasPanel />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
    )
}