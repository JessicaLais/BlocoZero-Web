import { useState, useEffect, useMemo } from 'react';
import IconePesquisa from '../assets/search-icon.svg';
import IconeDinheiro from '../assets/money-icon.svg';

import { InfoCard } from '../features/financeiro/components/InfoCard';
import { EtapaRow } from '../features/financeiro/components/EtapaRow';
import { TotalsTable } from '../features/financeiro/components/TotalsTable';

import { financeiroService } from '../services/financeiroService';
import type { RelatorioFinanceiroDTO } from '../dtos/financeiro'; // Agora vai achar o arquivo que criamos!
 // Agora vai achar o arquivo que criamos!

export function Fin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiroDTO | null>(null);

  // ID DA OBRA (Ainda fixo para teste)
  const WORK_ID = 1; 

  // --- 1. BUSCA DE DADOS ---
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const dados = await financeiroService.getRelatorio(WORK_ID);
        console.log("DADOS REAIS DO BACKEND:", dados);
        setRelatorio(dados);
      } catch (error) {
        console.error("Erro ao carregar tabela:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // --- 2. CABEÇALHO DA TABELA (Meses) ---
  const headers = useMemo(() => {
    // Se não tem dados ou a tabela está vazia, retorna array vazio para não quebrar
    if (!relatorio || !relatorio.tabela_dados || relatorio.tabela_dados.length === 0) return [];
    
    // Pega os meses da primeira linha para montar o cabeçalho
    return relatorio.tabela_dados[0].cronograma_financeiro.map(c => c.mes);
  }, [relatorio]);

  // --- 3. CÁLCULO DOS TOTAIS ---
  const { totaisMensais, totaisAcumulados } = useMemo(() => {
    // Proteção contra dados nulos
    if (!relatorio || !relatorio.tabela_dados || relatorio.tabela_dados.length === 0) {
      return { totaisMensais: [], totaisAcumulados: [] };
    }

    const qtdMeses = relatorio.tabela_dados[0].cronograma_financeiro.length;
    const somaMensal = new Array(qtdMeses).fill(0);
    const somaAcumulada: number[] = [];
    let acumulador = 0;

    // Percorre colunas (meses)
    for (let i = 0; i < qtdMeses; i++) {
      // Percorre linhas (etapas)
      relatorio.tabela_dados.forEach(linha => {
        const itemMes = linha.cronograma_financeiro[i];
        if (itemMes) {
          somaMensal[i] += itemMes.valor_bruto;
        }
      });
      // Acumula
      acumulador += somaMensal[i];
      somaAcumulada.push(acumulador);
    }

    return { totaisMensais: somaMensal, totaisAcumulados: somaAcumulada };
  }, [relatorio]);


  if (loading) {
    return <div className="min-h-screen bg-[#F5F5F5] p-8 flex items-center justify-center">Carregando relatório...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8 overflow-x-hidden">
      <main className="w-full max-w-[1600px] mx-auto">
        
        {/* HEADER & CARDS */}
        <section className="flex flex-col md:flex-row items-end justify-start gap-4 mb-8 flex-wrap">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 max-w-full">
             {/* PROTEÇÃO AQUI: Adicionei ?. antes de acessar as propriedades */}
             <InfoCard 
                title="Valor do contrato" 
                value={relatorio?.resumo?.valor_contrato || "R$ 0,00"} 
                icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} 
             />
             <InfoCard 
                title="Total Acumulado" 
                value={relatorio?.resumo?.total_acumulado_obra || "R$ 0,00"} 
                icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} 
             />
             <InfoCard 
                title="Disponível" 
                value={relatorio?.resumo?.valor_disponivel || "R$ 0,00"} 
                icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} 
             />
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

        {/* TABELA PRINCIPAL */}
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
                {relatorio?.tabela_dados && relatorio.tabela_dados.length > 0 ? (
                  relatorio.tabela_dados.map((linha, index) => (
                    <EtapaRow 
                      key={index} 
                      etapaNome={linha.nome_etapa}
                      totalEtapa={linha.total_etapa}
                      meses={linha.cronograma_financeiro.map(c => ({
                      percent: c.porcentagem,
                      value: c.valor_bruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      }))}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length > 0 ? headers.length + 2 : 2} className="p-8 text-center text-gray-500">
                      Nenhum dado encontrado para o relatório. <br/>
                      (Verifique se a API está rodando e se a obra tem dados)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* TOTAIS (RODAPÉ) */}
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