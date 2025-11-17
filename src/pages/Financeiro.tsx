import { useState } from 'react';
import { DollarSign, Binoculars, ChevronDown } from 'lucide-react'; 
import { InfoCard } from '../features/financeiro/components/InfoCard';
// 1. Importamos o novo componente de linha
import { EtapaRow } from '../features/financeiro/components/EtapaRow';

// 2. Definimos os dados mockados (provisórios) para a tabela
const mockData = [
  {
    etapa: 'Planejamento e Preparação',
    total: '16.389,49',
    meses: [
      { percent: '100%', value: '16.389,49' }, null, null, null, null, null, null, null, null, null
    ] as const
  },
  {
    etapa: 'Serviços Preliminares',
    total: '4.678,41',
    meses: [
      { percent: '100%', value: '4.678,41' }, null, null, null, null, null, null, null, null, null
    ] as const
  },
  {
    etapa: 'Infraestrutura',
    total: '6.178,89',
    meses: [
      { percent: '20%', value: '1.235,78' }, { percent: '80%', value: '4.943,11' }, null, null, null, null, null, null, null, null
    ] as const
  },
  {
    etapa: 'Alvenaria e Vedação',
    total: '45.783,90',
    meses: [
      null, { percent: '55%', value: '25.181,15' }, { percent: '45%', value: '20.603,76' }, { percent: '5%', value: '2.289,20' }, null, null, null, null, null, null
    ] as const
  },
  // (Adicione as outras linhas do figma aqui se quiser)
];

export function Fin() {
  const [searchTerm, setSearchTerm] = useState("");
  const valorFixo = "R$ 0.000.000,00";

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      <main className="max-w-7xl mx-auto">
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <InfoCard 
            title="Valor do contrato"
            value={valorFixo}
            icon={<DollarSign size={56} className="text-gray-800" />}
          />
          <InfoCard 
            title="Mês atual"
            value={valorFixo}
            icon={<DollarSign size={56} className="text-gray-800" />}
          />
          <InfoCard 
            title="Disponível"
            value={valorFixo}
            icon={<DollarSign size={56} className="text-gray-800" />}
          />
        </section>
        
        <section className="mt-8 flex justify-end">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Binoculars size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-full border-gray-400 bg-white p-3 pl-12 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* --- 3. NOVA SEÇÃO DA TABELA --- */}
        <section className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              
              {/* Cabeçalho da Tabela */}
              <thead className="border-b-2 border-gray-200">
                <tr>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase w-1/4">Etapa</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Total Etapa (R$)</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Jan/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Fev/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Mar/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Abr/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Mai/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Jun/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Jul/25</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 uppercase">Ago/25</th>
                </tr>
              </thead>

              {/* Corpo da Tabela */}
              <tbody>
                {/* 4. Usamos .map() para renderizar nosso componente de linha */}
                {mockData.map((data, index) => (
                  <EtapaRow 
                    key={index}
                    etapaNome={data.etapa}
                    totalEtapa={data.total}
                    meses={data.meses}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}