import { classMerge } from "../../../../utils/classMerge"
import { type IconType } from "react-icons";
type Props = {
    title: string
    value: string | number
    icon: IconType 
}

export function CardOrçamento({title, value, icon:Icon, ...rest}: Props) {
    return(
        

        <div className="w-[330px] h-[100px] flex bg-gray-500 border border-gray-300 rounded-lg p-5 shadow-md gap-10 ">
            <Icon size={65} className="text-gray-900"/>
            <div className="flex flex-col gap-2">
                <h1 className="text-xl text-gray-100">{title}</h1>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
        </div>
        
    )
}