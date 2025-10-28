// components/SelectForm.tsx

import { useId } from "react";
import { classMerge } from "../../../utils/classMerge";

// O tipo agora é para um elemento <select>
type Props = React.ComponentProps<"select"> & {
    legend?: string;
    legendColor?: string;
    containerClassName?: string;
}

export function SelectForm({
    legend,
    className,
    legendColor = "text-gray-950",
    containerClassName,
    children, // Precisamos da prop 'children' para passar os <option>
    ...rest
}: Props) {
    const id = useId();

    return (
        <div
            className={classMerge([
                "flex flex-row items-center gap-3",
                containerClassName
            ])}
        >
            {legend &&
                <label
                    htmlFor={id}
                    className={`text-sm font-medium whitespace-nowrap ${legendColor}`}
                >
                    {legend}
                </label>
            }
            {/* Trocamos o <input> por um <select> */}
            <select
                id={id}
                className={classMerge([
                    // Estilos base para se parecer com o InputForm
                    "flex-1 h-[26px] rounded-md border border-gray-400 bg-white px-2 text-sm text-gray-950 outline-none focus:ring-2 ",
                    className
                ])}
                {...rest}
            >
                {children} {/* Renderiza os <option> que serão passados */}
            </select>
        </div>
    )
}