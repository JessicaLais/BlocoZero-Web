import { FormularioProgresso } from "../features/relatorios/components/FormularioProgresso";
import { ImageUpload } from "../features/relatorios/components/ImageUpload";
import { Button } from "../features/auth/components/Button"; 

export function Relatorios() {
    
    const handleFormSubmit = (data: any) => {
        console.log("DADOS RECEBIDOS:", data);
        alert("");
    };

    return (
        <div className="w-full p-8 bg-white min-h-screen">
            
            <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800">Relatório de Progresso</h1>
                <div className="w-full h-[1px] bg-gray-300 mt-2"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <FormularioProgresso onSubmit={handleFormSubmit} />
                </div>
                <div className="w-full lg:w-[400px] flex flex-col justify-center mt-8 lg:mt-0">
                    
                    <div className="lg:mt-[190px]">
                        <ImageUpload />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button 
                            type="submit" 
                            form="form-progresso" 
                            className="bg-[#E0E0E0] text-black border border-gray-400 hover:bg-gray-300 w-32 h-9 rounded-sm text-sm font-normal shadow-sm"
                        >
                            Enviar
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}