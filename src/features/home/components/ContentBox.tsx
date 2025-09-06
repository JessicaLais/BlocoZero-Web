import { formatDate } from "../../../utils/formatDate";
export type ContentBoxProps = {
    data : {
        id: string;
        title: string;
        enterprise_name: string;
        photo_url: string;
        start_date?: string | null;
        end_date?: string | null;
    }
}
export function ContentBox({data}: ContentBoxProps) {
    const formattedStartDate = data.start_date ? formatDate(data.start_date) : '';
    const formattedEndDate = data.end_date ? formatDate(data.end_date) : '';
    return (
        <main className="bg-white rounded-sm shadow-xl w-full  2xl:max-h-[400px] flex">
            <div className=" flex-shrink-0">
                <img
                    src={data.photo_url}
                    alt="Prédio Lincoln"
                    className="2xl:max-h-[380px] md:max-h-[290px] h-auto w-full object-cover"
                />
            </div>

            <div className='flex flex-col text-gray-950 p-4 md:p-6 lg:p-8 justify-center'>
                <section className='md:text-lg 2xl:text-2xl flex flex-col md:gap-2 2xl:gap-4'>
                    <h1 className='font-bold text-2xl 2xl:text-4xl text-gray-800 mb-2'>{data.title}</h1>
                    <p className="text-gray-600"><strong>Local:</strong> xxxxx</p>
                    <p className="text-gray-600"><strong>Empresa:</strong> {data.enterprise_name} </p>
                    <p className="text-gray-600"><strong>CNPJ:</strong> XXXXXXX</p>
                    <p className="text-gray-600"><strong>Data de inicio:</strong> {formattedStartDate}</p>
                    <p className="text-gray-600"><strong>Previsão de Termino:</strong> {formattedEndDate}</p>
                </section>
            </div>
        </main>
    )
}