import { api } from './api';

// Essa interface precisa estar exportada aqui para o erro de import sumir
export interface RelatorioEnvioDTO {
  id_work: number;
  id_user: number;
  id_stage: number;
  id_substage: number; // Obrigatório
  startDate: string;
  endDate: string;
  weather: string;
  completionPercentage: number;
  notes: string;
  photo: File | null; 
}

export const relatorioService = {
  createRelatorio: async (dados: RelatorioEnvioDTO) => {
    try {
      const formData = new FormData();
      
      formData.append('id_work', String(dados.id_work));
      formData.append('id_user', String(dados.id_user)); 
      formData.append('id_stage', String(dados.id_stage));
      
      // Enviando Subetapa obrigatória
      formData.append('id_substage', String(dados.id_substage));
      
      formData.append('startDate', dados.startDate);
      formData.append('endDate', dados.endDate);
      formData.append('weather', dados.weather);
      formData.append('completionPercentage', String(dados.completionPercentage));
      formData.append('notes', dados.notes);
      formData.append('status', 'PENDENTE');

      if (dados.photo) {
        formData.append('photo', dados.photo);
      } else {
        throw new Error("A foto é obrigatória!");
      }

      // --- CORREÇÃO DO ERRO 404 ---
      // Mudamos de "/progress-report" para "/progressReport" (igual ao server.js)
      const response = await api.post('/progressReport/register', formData);
      return response.data;

    } catch (error: any) {
      console.error("Erro ao enviar relatório:", error);
      throw error; 
    }
  },

  getEtapas: async (workId: number) => {
    try {
      const response = await api.get(`/stage/list/${workId}`);
      return Array.isArray(response.data) ? response.data : (response.data.stages || []);
    } catch (error) {
      console.error("Erro ao buscar etapas:", error);
      return [];
    }
  },

  getSubetapasByWork: async (workId: number) => {
    try {
      const response = await api.get(`/substage/list/${workId}`);
      // Tratamento para pegar dados aninhados do backend
      const rawData = response.data.subStages || [];
      const listaPlana = rawData.flat();

      return listaPlana.map((item: any) => ({
        id_substage: item.substage.id_substage, 
        name: item.substage.name,               
        stage_id: item.stageId                  
      }));

    } catch (error) {
      console.error("Erro ao buscar subetapas:", error);
      return [];
    }
  }
};