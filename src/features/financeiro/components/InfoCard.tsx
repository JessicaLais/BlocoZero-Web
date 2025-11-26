import type { ReactNode } from 'react';

type InfoCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
};

export function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    // MUDANÇA AQUI: Aumentamos a largura mínima de 250px para 340px
    <div className="flex items-center gap-4 rounded-xl bg-gray-300 p-6 shadow min-w-[340px]">
      <div className="text-gray-800">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-700">{title}</span>
        <span className="text-3xl font-bold text-gray-900 whitespace-nowrap">{value}</span>
      </div>
    </div>
  );
}