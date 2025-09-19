import { formatDate } from "../../../utils/formatDate";
export type ContentBoxProps = {
    data : {
        id: string;
        title: string;
        enterprise: string;
        photoUrl: string;
        startDate?: string | null;
        endDate?: string | null;
        location: string;
        description: string;
    }
}
export function ContentBox({data}: ContentBoxProps) {
    const formattedStartDate = data.startDate ? formatDate(data.startDate) : '';
    const formattedEndDate = data.endDate ? formatDate(data.endDate) : '';
    return (
        <main className="bg-white rounded-sm shadow-xl w-full  2xl:max-h-[400px] flex">
            <div className=" flex-shrink-0">
                <img
                    src={data.photoUrl}
                    alt="Prédio Lincoln"
                    className="2xl:max-h-[380px] md:max-h-[312px] h-auto w-full object-cover"
                />
            </div>

            <div className='flex flex-col text-gray-950 p-4  lg:p-8 justify-center'>
                <section className='md:text-lg 2xl:text-2xl flex flex-col md:gap-2 2xl:gap-4'>
                    <h1 className='font-bold text-2xl 2xl:text-4xl text-gray-800 mb-2'>{data.title}</h1>
                    <p className="text-gray-600"><strong>Local:</strong> {data.location}</p>
                    <p className="text-gray-600"><strong>Empresa:</strong> {data.enterprise} </p>
                    <p className="text-gray-600"><strong>Descrição:</strong> {data.description}</p>
                    <p className="text-gray-600"><strong>Data de inicio:</strong> {formattedStartDate}</p>
                    <p className="text-gray-600"><strong>Previsão de Termino:</strong> {formattedEndDate}</p>
                </section>
            </div>
        </main>
    )
}