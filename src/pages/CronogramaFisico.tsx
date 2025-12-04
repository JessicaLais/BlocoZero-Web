import React, { useState } from "react";
import { DiagramaGantt } from "../features/gestor/componentes/cronograma/DiagramaGantt";
import { GanttStatsCards } from "../features/gestor/componentes/cronograma/GanttStatsCards";


export function CronogramaPage() {
  const id_work = 1; 
  const [stats, setStats] = useState({ dentro: "0.00", adiantadas: "0.00", atrasadas: "0.00" });

  return (
    <div className="flex flex-col h-full">
      <GanttStatsCards stats={stats} />
      <div className="p-4 bg-white rounded shadow mt-4">
        <DiagramaGantt id_work={id_work} onChangeStats={setStats} />
      </div>
    </div>
  );
}
