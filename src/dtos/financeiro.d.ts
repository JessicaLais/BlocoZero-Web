// src/dtos/financeiro.d.ts
export interface ObraDTO {
  id_work: number;
  title: string;
  budget: number;      // Valor do contrato
  start_time: string;  // Data de início
  end_time: string;    // Data de término
}

export interface EtapaDTO {
  id_stage: number;
  name: string;
  progress: number;
  expStartDate: string;
  expEndDate: string;
  id_work: number;
}

export interface OrcamentoDTO {
  id_budget: number;
  id_work: number;
  allocated_stage_id: number; // Importante para sabermos de qual etapa é esse valor
  hours_worked?: number;
  hourlyRate?: number; // Supondo que venha o valor da hora
  costUnit?: number;   // Se for material
}