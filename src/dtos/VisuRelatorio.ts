export interface RelatorioDetalhado {
  id: number;
  // Use os nomes EXATOS que vêm do seu backend
  startDate: string; 
  endDate: string;
  status: 'PENDING' | 'VALIDATED' | 'REFUSED';
  

  id_work: number;
  id_user: number;
  id_stage: number;    // Em vez de 'etapa'
  id_substage: number; // Em vez de 'subetapa'
  
  // Dados
  weather: string;              // Em vez de 'clima'
  completionPercentage: number; // Em vez de 'percentual'
  notes: string;                // Em vez de 'observacoes'
  photo: string | null;         // Em vez de 'imagemUrl'
  
  // Opcional: Se o backend mandar o objeto da obra aninhado
  work?: {
    name: string;
  };
}
