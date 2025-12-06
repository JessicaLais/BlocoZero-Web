import blocoZeroLogo  from '../../../assets/blocoZeroLogo.svg'
import blocoZeroLogo1 from '../../../assets/blocoZeroLogo1.svg'
export function LogoAuth(){
    return(
        <div className="flex items-center justify-center w-1/2 h-screen bg-white-100">
            <img src={blocoZeroLogo} alt="Bloco Zero Logo" className="size-120" />
        </div>
    )
}