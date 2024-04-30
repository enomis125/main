'use client'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaSignInAlt } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaExpand } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import Loader from '../../Loader/Loader';


export default function Navbar({ toggle, children, breadcrumbs }) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(router.query?.error);
    const [searchVisible, setSearchVisible] = useState(false);


    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    return (
        <nav className="bg-white w-full shadow-md sticky top-0 z-30 h-16">
            <div className="  w-full flex items-center justify-between py-4 px-6">

                <div className="flex  items-center">
                    {toggle}
                </div>

                <div className="flex flex-1 lg:px-72">
                    {breadcrumbs}
                </div>

                <div className="flex items-center space-x-4">

                    <a  className="cursor-pointer text-bg-gray-400 hover:text-bold py-2 px-4 flex items-center">
                        <FaSignOutAlt className="mt-1" /><span className="ml-1 hidden sm:block"></span>
                    </a>

                    <a onClick={toggleFullScreen} className="cursor-pointer text-black hover:text-bold py-2 px-4 flex items-center">
                        <FaExpand className="mt-1" /><span className="ml-1 hidden sm:block"></span>
                    </a>

                    <a onClick={() => setSearchVisible(!searchVisible)} className="cursor-pointer text-black hover:text-bold py-2 px-4 flex items-center">
                        <FaSearch className="mt-1" /><span className="ml-1 hidden sm:block"></span>
                    </a>

                    {searchVisible && (
                        <div className="absolute right-0 top-12 p-2 bg-white border border-gray-300 rounded-lg">
                            {/* Barra de pesquisa */}
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-2 py-1"
                                    placeholder="Pesquisar..."
                                />
                                <button
                                    onClick={() => setSearchVisible(false)}
                                    className="text-black hover:text-bold ml-2"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </nav>
    );
}
