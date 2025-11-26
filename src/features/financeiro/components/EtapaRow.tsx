import { ChevronDown } from 'lucide-react';

// 1. Definimos o tipo de dado para uma célula de mês
// (Pode ser um objeto com dados ou 'null' se a célula estiver vazia)
type MonthData = {
  percent: string;
  value: string;
} | null;

// 2. Definimos as props que a nossa linha de etapa vai receber
type EtapaRowProps = {
  etapaNome: string;
  totalEtapa: string;
  // Dizemos ao TypeScript que esperamos um array 'readonly' (boa prática)
  meses: readonly [
    MonthData, MonthData, MonthData, MonthData, MonthData, 
    MonthData, MonthData, MonthData, MonthData, MonthData
  ];
};

// 3. O componente
export function EtapaRow({ etapaNome, totalEtapa, meses }: EtapaRowProps) {
  return (
    <tr className="border-b border-gray-200">
      
      {/* Coluna 1: Nome da Etapa */}
      <td className="py-4 px-4 font-medium text-gray-900">
        <div className="flex items-center gap-2">
          <ChevronDown size={16} />
          <span>{etapaNome}</span>
        </div>
      </td>
      
      {/* Coluna 2: Total da Etapa */}
      <td className="py-4 px-4 text-gray-700">
        {totalEtapa}
      </td>
      
      {/* Colunas 3-12: Meses (Renderização dinâmica) */}
      {meses.map((mes, index) => (
        <td key={index} className="py-4 px-4">
          {/* Se 'mes' tiver dados, renderiza a célula. Senão, fica em branco. */}
          {mes && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">{mes.percent}</span>
              <span className="text-xs text-gray-600">{mes.value}</span>
            </div>
          )}
        </td>
      ))}

    </tr>
  );
}