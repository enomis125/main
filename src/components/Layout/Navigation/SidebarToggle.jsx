"use client"
import { GiHamburgerMenu } from "react-icons/gi";
import { FiMenu } from 'react-icons/fi';
import { VscClose } from 'react-icons/vsc';

const SidebarToggle = ({ showSidebar, setShowSidebar }) => {
    return (
        <button className="text-2xl text-slate-600 mx-1 lg:hidden hover:bg-gray-100 p-2 rounded-md" onClick={() => setShowSidebar(!showSidebar)}>
            {(showSidebar) ? <VscClose /> : <FiMenu />}
        </button>
    )
}

export default SidebarToggle
