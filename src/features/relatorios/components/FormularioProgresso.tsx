import { useState } from 'react';

// Aceita a função onSubmit do pai
export function FormularioProgresso({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    etapa: '',
    inicio: '',
    fim: '',
    subetapa: '',
    percentual: '',
    clima: '',
    observacoes: ''
  });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Se for o campo percentual, aplica a regra 0-100
    if (name === 'percentual') {
        const num = parseInt(value);
        if (num < 0) finalValue = "0";
        if (num > 100) finalValue = "100";
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = "border border-gray-400 rounded-sm h-[30px] px-2 text-sm focus:outline-none focus:border-gray-600 bg-white shadow-sm";
  const labelStyle = "text-sm font-normal text-gray-900 whitespace-nowrap min-w-max";

  return (
    // IMPORTANTE: O id="form-progresso" é o elo de ligação com o botão de fora
    <form id="form-progresso" className="w-full" onSubmit={handleSubmit}>
      
      {/* LINHA 1 */}
      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <div className="flex items-center gap-3 flex-1">
            <label className={labelStyle}>Etapa:</label>
            <select name="etapa" className={`${inputStyle} w-full`} value={formData.etapa} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="1">Fundação</option>
                <option value="2">Estrutura</option>
            </select>
        </div>
        <div className="flex gap-6">
            <div className="flex items-center gap-3">
                <label className={labelStyle}>Início:</label>
                <input type="date" name="inicio" className={`${inputStyle} w-36`} value={formData.inicio} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-3">
                <label className={labelStyle}>Fim:</label>
                <input type="date" name="fim" className={`${inputStyle} w-36`} value={formData.fim} onChange={handleChange} />
            </div>
        </div>
      </div>

      {/* LINHA 2 */}
      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <div className="flex items-center gap-3 flex-[2]">
            <label className={labelStyle}>Subetapa:</label>
            <input type="text" name="subetapa" className={`${inputStyle} w-full`} value={formData.subetapa} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-3">
            <label className={labelStyle}>Percentual de conclusão:</label>
            <div className="flex items-center gap-2">
                <input type="number" name="percentual" className={`${inputStyle} w-20 text-center`} placeholder="0" value={formData.percentual} onChange={handleChange} />
                <span className="text-sm font-bold">%</span>
            </div>
        </div>
      </div>

      {/* LINHA 3 */}
      <div className="flex items-center gap-3 mb-8 w-full xl:w-1/3">
        <label className={labelStyle}>Clima:</label>
        <select name="clima" className={`${inputStyle} w-full`} value={formData.clima} onChange={handleChange}>
            <option value="">Selecione...</option>
            <option value="sol">Ensolarado ☀️</option>
            <option value="chuva">Chuvoso 🌧️</option>
        </select>
      </div>

      {/* LINHA 4 */}
      <div className="mb-4">
        <label className={`${labelStyle} mb-2 block`}>Observações:</label>
        <textarea name="observacoes" rows={8} className="w-full border border-gray-400 rounded-sm p-2 text-sm resize-none focus:outline-none focus:border-gray-600 shadow-sm" value={formData.observacoes} onChange={handleChange}></textarea>
      </div>

      {/* REMOVI O BOTÃO DAQUI. AGORA ELE SÓ EXISTE NO COMPONENTE PAI */}

    </form>
  );
}