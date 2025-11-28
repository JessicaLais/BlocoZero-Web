import { useState, useMemo } from 'react';
import { DollarSign, Binoculars } from 'lucide-react';
import { InfoCard } from '../features/financeiro/components/InfoCard';
import { EtapaRow } from '../features/financeiro/components/EtapaRow';
import { TotalsTable } from '../features/financeiro/components/TotalsTable';

// --- TIPO DEFINIDO LOCALMENTE ---
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
  const valorFixo = "R$ 0.000.000,00";

  const projectConfig = { startMonth: 0, startYear: 2025, durationMonths: 12 };

  const headers = useMemo(() => 
    generateMonthHeaders(projectConfig.startMonth, projectConfig.startYear, projectConfig.durationMonths),
    []
  );

  // --- MOCK DATA ---
  const mockData = [
    {
      etapa: 'Planejamento e Preparação',
      total: '16.389,49',
      dadosMensais: { 0: { percent: '100%', value: '16.389,49' } }
    },
    {
      etapa: 'Serviços Preliminares',
      total: '4.678,41',
      dadosMensais: { 0: { percent: '100%', value: '4.678,41' } }
    },
    {
      etapa: 'Infraestrutura',
      total: '6.178,89',
      dadosMensais: { 
        0: { percent: '20%', value: '1.235,78' }, 
        1: { percent: '80%', value: '4.943,11' } 
      }
    },
    {
      etapa: 'Alvenaria e Vedação',
      total: '45.783,90',
      dadosMensais: {
        1: { percent: '55%', value: '25.181,15' },
        2: { percent: '45%', value: '20.603,76' },
        3: { percent: '5%', value: '2.289,20' }
      }
    },
    {
      etapa: 'Cobertura',
      total: '34.893,90',
      dadosMensais: {
        2: { percent: '50%', value: '17.446,95' },
        3: { percent: '50%', value: '17.446,95' }
      }
    },
    {
      etapa: 'Instalações',
      total: '9.353,87',
      dadosMensais: {
        4: { percent: '53%', value: '4.957,55' },
        5: { percent: '37%', value: '3.461,93' },
        6: { percent: '10%', value: '935,39' }
      }
    },
    {
      etapa: 'Acabamento',
      total: '12.732,67',
      dadosMensais: {
        6: { percent: '47%', value: '5.983,35' },
        7: { percent: '53%', value: '6.749,32' }
      }
    },
    {
      etapa: 'Esquadrias e Vidros',
      total: '6.178,89',
      dadosMensais: {
        7: { percent: '100%', value: '6.178,89' }
      }
    }
  ];

  const buildRowData = (dadosMensais: any): MonthData[] => {
    const dados = dadosMensais || {}; 
    return Array.from({ length: projectConfig.durationMonths }, (_, index) => {
      return dados[index] || null;
    });
  };

  const calculateTotals = () => {
    const totaisMensais = new Array(projectConfig.durationMonths).fill(0);
    let acumulado = 0;
    const totaisAcumulados: number[] = [];
    
    for (let i = 0; i < projectConfig.durationMonths; i++) {
      let somaMes = 0;
      mockData.forEach(row => {
        // @ts-ignore
        const cellData = row.dadosMensais[i];
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

  return (
    // AJUSTE 1: 'overflow-x-hidden' no body para evitar scroll duplo indesejado na página inteira
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8 overflow-x-hidden">
      
      {/* AJUSTE 2: 'w-full' garante que usa a tela toda do notebook, mas 'max-w-[1600px]' segura em telas gigantes */}
      <main className="w-full max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        {/* AJUSTE 3: 'flex-wrap' permite que, se a tela for MUITO pequena (celular), os itens quebrem linha suavemente em vez de sumir */}
        <section className="flex flex-col md:flex-row items-end justify-start gap-4 mb-8 flex-wrap">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 max-w-full">
             <InfoCard title="Valor do contrato" value={valorFixo} icon={<DollarSign size={48} />} />
             <InfoCard title="Mês atual" value={valorFixo} icon={<DollarSign size={48} />} />
             <InfoCard title="Disponível" value={valorFixo} icon={<DollarSign size={48} />} />
          </div>

          <div className="relative w-72 pb-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pb-1">
              <Binoculars size={20} className="text-gray-400" />
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

        {/* TABELA - O 'overflow-x-auto' aqui é o herói que permite rolar a tabela em telas menores */}
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
                {mockData.map((data, index) => (
                  <EtapaRow 
                    key={index}
                    etapaNome={data.etapa}
                    totalEtapa={data.total}
                    meses={buildRowData(data.dadosMensais)}
                  />
                ))}
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