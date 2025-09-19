import { useState } from 'react';
import { FaHome, FaCalendarAlt, FaBox, FaChartBar, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import blocoZeroLogoSvg from "../assets/blocoZeroLogo.svg";
import Teste from "../assets/Teste.png";
import { Link } from 'react-router-dom';

export function Sidebar() {
    const [isStockDropdownOpen, setStockDropdownOpen] = useState(false);

    const handleStockClick = () => {
        setStockDropdownOpen(!isStockDropdownOpen);
    };

    return (
        <aside className="w-40 h-screen bg-blue-400 text-white flex flex-col">
            <div className="flex items-center gap-3 mb-10">
                <Link to={`/work`}>
                    <img src={Teste} className='cursor-pointer'></img>
                </Link>
            </div>

            <nav className="flex flex-col gap-4">
                <Link to={`/work`} className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md font-semibold ">
                    <FaHome size={20} />
                    <span>Início</span>
                </Link>

                <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md">
                    <FaCalendarAlt size={20} />
                    <span>Cronograma</span>
                </a>

                {/* Item de Estoque com Dropdown */}
                <div className="relative">
                    <button
                        onClick={handleStockClick}
                        className="flex items-center justify-between w-full p-2 hover:bg-gray-600 transition ease-linear rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <FaBox size={20} />
                            <span>Estoque</span>
                        </div>
                        {isStockDropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
                    </button>

                    {isStockDropdownOpen && (
                        <div className="flex flex-col gap-2 px-3 mt-2 max-h-40">
                            <Link to="/estoque" className="p-2 text-sm hover:bg-gray-600 transition ease-linear rounded-md">
                                Consultar 
                            </Link>
                           {/* hover:bg-gray-700 transition ease-linear rounded-md*/}
                            <Link to="/registrar-equipamentos" className="p-2 w-xxs text-sm hover:bg-gray-600 transition ease-linear rounded-md">
                                Registrar 
                            </Link>
                            
                        </div>
                    )}
                </div>

                <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md">
                    <FaChartBar size={20} />
                    <span>Relatórios</span>
                </a>
            </nav>
        </aside>
    );
}