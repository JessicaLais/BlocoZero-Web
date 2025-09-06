// FilterStatic.tsx


export function FilterStatic() {
  return (
    <div className="p-4 bg-gray-200 rounded-md shadow-md mb-4">
      <h3 className="text-lg font-bold mb-2">Filtrar Insumos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="code" className="mb-1 text-sm font-medium">Código:</label>
          <input
            type="text"
            id="code"
            name="code"
            className="p-2 border bg-white border-gray-300 rounded-md"
            placeholder="Filtrar por código..."
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-sm font-medium">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="p-2 border bg-white border-gray-300 rounded-md"
            placeholder="Filtrar por nome..."
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="type" className="mb-1 text-sm font-medium">Tipo:</label>
          <select
            id="type"
            name="type"
            className="p-[10.5px] border bg-white border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="Material">Material</option>
            <option value="Equipamento">Equipamento</option>
          </select>
        </div>
      </div>
    </div>
  );
}