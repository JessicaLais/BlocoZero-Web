export type CardsProps = {
    data : {
        budget: string
        employees: number
        progress: string
    }
}
export function Cards({data}: CardsProps){
    return (
        <div className="flex justify-center items-center w-full gap-4 md:gap-8 lg:gap-12 p-4 2xl:mt-10">
            <div className="flex flex-col items-center w-full max-w-[200px] h-38 bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Orçamento</h1>
                <p className="text-3xl text-gray-900 font-semibold mt-4">{data.budget}</p>
            </div>

            <div className="flex flex-col items-center w-full max-w-[200px] h-38 bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Gastos</h1>
                <p className="text-3xl text-gray-900 font-semibold mt-4">200,000,00</p>
            </div>

            <div className="flex flex-col items-center w-full max-w-[200px] h-38 bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Operadores</h1>
                <p className="text-3xl text-gray-900 font-semibold mt-4">{data.employees}</p>
            </div>

            <div className="flex flex-col items-center w-full max-w-[200px] h-38 bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Progresso</h1>
                <p className="text-3xl text-gray-900 font-semibold mt-4">{data.progress}%</p>
            </div>
        </div>
    );
}