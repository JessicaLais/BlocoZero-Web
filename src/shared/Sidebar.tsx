import { FaHome, FaCalendarAlt, FaBox, FaChartBar } from 'react-icons/fa';
import blocoZeroLogoSvg from "../assets/blocoZeroLogo.svg";
import { Link } from 'react-router-dom';
export function Sidebar() {
  return (
      <aside className="w-40 h-screen bg-blue-400 text-white flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <Link to={`/work`} >
          <img src={blocoZeroLogoSvg} className='cursor-pointer'></img>
        </Link>
        </div>

      <nav className="flex flex-col gap-4">
        <Link to={`/work`}className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md font-semibold ">
          <FaHome size={20} /> 
          <span>Início</span>
        </Link>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md">
          <FaCalendarAlt size={20} /> 
          <span>Cronograma</span>
        </a>
        <Link to={`/estoque`} className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md">
          <FaBox size={20} /> 
          <span>Estoque</span>
        </Link>
        <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-600 transition ease-linear rounded-md">
          <FaChartBar size={20} /> 
          <span>Relatórios</span>
        </a>
      </nav>
    </aside>
  );
}