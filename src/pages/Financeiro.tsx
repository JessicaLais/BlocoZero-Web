import { useState, useMemo, useEffect } from 'react';
import IconePesquisa from '../assets/search-icon.svg';
import IconeDinheiro from '../assets/money-icon.svg';

import { InfoCard } from '../features/financeiro/components/InfoCard';
import { EtapaRow } from '../features/financeiro/components/EtapaRow';
import { TotalsTable } from '../features/financeiro/components/TotalsTable';
import { financeiroService } from '../services/financeiroService';
import type { EtapaDTO } from '../dtos/financeiro';

type MonthData = {
  percent: string;
  value: string;
} | null;

// --- LÓGICA DE DATAS ---
const generateMonthHeaders = (startMonth: number, startYear: number, count: number) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(startYear, startMonth + i);
    const monthName = months[date.getMonth()];
    const yearShort = date.getFullYear().toString().slice(-2);
    return `${monthName}/${yearShort}`;
  });
};

export function Fin() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // ESTADOS
  const [etapas, setEtapas] = useState<EtapaDTO[]>([]);
  const [valorContrato, setValorContrato] = useState("R$ 0,00");
  const [loading, setLoading] = useState(true);

  const WORK_ID = 1; 
  const projectConfig = { startMonth: 0, startYear: 2025, durationMonths: 12 };

  const headers = useMemo(() => 
    generateMonthHeaders(projectConfig.startMonth, projectConfig.startYear, projectConfig.durationMonths),
    []
  );

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        
        // 1. Busca Obra
        const obra = await financeiroService.getObra(WORK_ID);
        if (obra) {
          const valor = obra.budget ?? 0;
          setValorContrato(valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
        }

        // 2. Busca Etapas
        const listaEtapas = await financeiroService.getEtapas(WORK_ID);
        setEtapas(Array.isArray(listaEtapas) ? listaEtapas : []);

      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
        setEtapas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // --- PREPARAR DADOS PARA TABELA ---
  const tableData = useMemo(() => {
    return (etapas || []).map(etapa => ({
      etapa: etapa.name,
      total: "R$ 0,00", 
      dadosMensais: {} 
    }));
  }, [etapas]);

  const buildRowData = (dadosMensais: any): MonthData[] => {
    const dados = dadosMensais || {}; 
    return Array.from({ length: projectConfig.durationMonths }, (_, index) => {
      return dados[index] || null;
    });
  };

  // --- CÁLCULO DOS TOTAIS ---
  const calculateTotals = () => {
    const totaisMensais = new Array(projectConfig.durationMonths).fill(0);
    let acumulado = 0;
    const totaisAcumulados: number[] = [];
    
    for (let i = 0; i < projectConfig.durationMonths; i++) {
      let somaMes = 0;
      tableData.forEach(row => {
        // @ts-ignore
        const cellData = row.dadosMensais?.[i]; 
        if (cellData && cellData.value) {
          try {
            const valorLimpo = cellData.value.replace(/\./g, '').replace(',', '.');
            somaMes += parseFloat(valorLimpo) || 0;
          } catch (e) {
            console.error(e);
          }
        }
      });
      totaisMensais[i] = somaMes;
      acumulado += somaMes;
      totaisAcumulados.push(acumulado);
    }
    return { totaisMensais, totaisAcumulados };
  };

  const { totaisMensais, totaisAcumulados } = calculateTotals();

  if (loading) {
    return <div className="min-h-screen bg-[#F5F5F5] p-8 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8 overflow-x-hidden">
      <main className="w-full max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <section className="flex flex-col md:flex-row items-end justify-start gap-4 mb-8 flex-wrap">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 max-w-full">
             <InfoCard title="Valor do contrato" value={valorContrato} icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />}/>
             <InfoCard title="Mês atual" value="R$ 0,00" icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} />
             <InfoCard title="Disponível" value={valorContrato} icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} />
          </div>

          <div className="relative w-72 pb-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pb-1">
          <img src={IconePesquisa} alt="Pesquisar" className="w-5 h-5" />
          </div>
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-gray-500 focus:outline-none shadow-sm"
            />
          </div>
        </section>

        {/* TABELA */}
        <section className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-300">
                <tr>
                  <th className="py-4 px-4 text-xs font-semibold text-gray-600 uppercase w-64 sticky left-0 bg-white z-20 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    Etapa
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-gray-600 uppercase border-r border-gray-200 text-right min-w-[120px]">
                    Total Etapa (R$)
                  </th>
                  {headers.map((header, index) => (
                    <th key={index} className="py-4 px-4 text-xs font-semibold text-gray-600 uppercase text-center border-r border-gray-200 min-w-[100px]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead> 
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((data, index) => (
                    <EtapaRow 
                      key={index}
                      etapaNome={data.etapa}
                      totalEtapa={data.total}
                      meses={buildRowData(data.dadosMensais)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="p-8 text-center text-gray-500">
                      Nenhuma etapa encontrada para esta obra (ID {WORK_ID}). <br/>
                      Verifique se você cadastrou etapas no banco de dados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* TOTAIS */}
        <section className="mt-6 w-full overflow-x-auto">
          <TotalsTable 
            mesesLabels={headers}
            totaisMensais={totaisMensais}
            totaisAcumulados={totaisAcumulados}
          />
        </section>

      </main>
    </div>
  );
}