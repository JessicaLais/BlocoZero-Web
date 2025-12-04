// src/dtos/financeiro.ts

export interface CronogramaMensal {
  mes: string;          // Ex: "jan/25"
  valor: string;        // Ex: "1500.00" (String vinda do back)
  porcentagem: string;  // Ex: "10%"
  valor_bruto: number;  // Ex: 1500 (Number para contas)
}

export interface LinhaRelatorio {
  id_etapa: number;
  nome_etapa: string;
  total_etapa: string;
  cronograma_financeiro: CronogramaMensal[];
}

export interface ResumoRelatorio {
  valor_contrato: string;
  valor_disponivel: string;
  total_acumulado_obra: string;
}

export interface RelatorioFinanceiroDTO {
  resumo: ResumoRelatorio;
  tabela_dados: LinhaRelatorio[];
}