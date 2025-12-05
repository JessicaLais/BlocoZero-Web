import { useEffect, useState } from "react";
import { GanttStatsCards } from "../features/gestor/componentes/cronograma/GanttStatsCards";
import { CronogramaTable } from "../features/gestor/componentes/cronograma/CronogramaTable";
import { CronogramaToolbar } from "../features/gestor/componentes/cronograma/CronogramaToolbar";
import { api } from "../services/api";

interface StageOption {
    id: number;
    name: string;
}

export function CronogramaPage() {
  const id_work = 1; 
  const [stats, setStats] = useState({ dentro: "0.00", adiantadas: "0.00", atrasadas: "0.00" });
  
  // Estado para o filtro
  const [stageOptions, setStageOptions] = useState<StageOption[]>([]);
  const [filterStageId, setFilterStageId] = useState("");

  // BUSCA DINÂMICA DAS ETAPAS PARA O FILTRO
  useEffect(() => {
      const fetchStages = async () => {
          try {
              // Chama a API de listagem de etapas
              const response = await api.get(`/stage/list/${id_work}`);
              const data = response.data.stages || response.data || [];
              
              // Mapeia para o formato do select
              const options = data.map((s: any) => ({
                  id: s.id_stage,
                  name: s.name
              }));
              setStageOptions(options);
          } catch (error) {
              console.error("Erro ao carregar filtro de etapas:", error);
          }
      };
      fetchStages();
  }, []);

  const handleFilterChange = (val: string) => {
      setFilterStageId(val);
  };

  return (
    <div className="flex flex-col h-full bg-white p-2 overflow-y-auto">
      
      <GanttStatsCards stats={stats} />

      {/* O Toolbar recebe a lista dinâmica 'stageOptions' */}
      <CronogramaToolbar 
          stages={stageOptions} 
          onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
        <CronogramaTable 
            id_work={id_work} 
            onChangeStats={setStats} 
            filterStageId={filterStageId} 
        />
      </div>
    </div>
  );
}