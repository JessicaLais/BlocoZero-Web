import { classMerge } from "../../../utils/classMerge"

type Props = React.ComponentProps<"input"> & {
    legend?: string
    legendColor?: string
}

export function InputAuth({ legend, type="text", className, legendColor = "text-white", ...rest}: Props) {
    return(
        <fieldset className="flex flex-col gap-2 w-full">
            {legend && <legend className={`text-sm py-1 ${legendColor}`}>{legend}</legend>}
            <input type={type} className={classMerge(["w-full h-12 rounded-lg bg-white px-4 text-sm text-gray-500  outline-none focus:border-2 focus:border-gray-300  placeholder-gray-300", className])} {...rest} />
        </fieldset>
    )
}