export type StatusRelatorio = 'PENDENTE' | 'APROVADO' | 'INVALIDO';

export interface RelatorioProgressoDTO {
  id_progressSubstageReport: number;
  id_work: number;
  id_user: number;
  id_stage: number;
  id_substage: number;
  startDate: string;
  endDate: string; // Vamos usar essa como a "Data" da tabela
  weather: string;
  completionPercentage: number;
  notes: string;
  status: StatusRelatorio;
  managerRejectionReason?: string;
  photo?: string; // Vem em base64 se existir
}