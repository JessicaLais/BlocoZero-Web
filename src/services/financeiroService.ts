import { api } from './api';
import type { ObraDTO, EtapaDTO, OrcamentoDTO } from '../dtos/financeiro'; 

export const financeiroService = {

  getObra: async (workId: number) => {
    try {
      const response = await api.get(`/work/specific/${workId}`);
      return response.data as ObraDTO;
    } catch (error) {
      console.error("Erro ao buscar obra:", error);
      throw error;
    }
  },

  getEtapas: async (workId: number) => {
    try {
      const response = await api.get(`/stage/list/${workId}`);
      return (response.data || []) as EtapaDTO[]; 
    } catch (error) {
      console.error("Erro ao buscar etapas:", error);
      return []; 
    }
  },

  getOrcamentos: async () => {
    try {
      const response = await api.get('/budget/list');
      return (response.data || []) as OrcamentoDTO[];
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error);
      return [];
    }
  }
};