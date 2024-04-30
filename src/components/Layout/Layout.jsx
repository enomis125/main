"use client"
import Head from 'next/head';
import Sidebar from './Navigation/Sidebar';
import Navbar from './Navigation/Navbar';
import SidebarToggle from './Navigation/SidebarToggle';
import Breadcrumb from './Breadcrumb';
import { useState } from 'react';

const Layout = ({ children, name }) => {
    // Components
    const [showSidebar, setShowSidebar] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className='h-screen w-full absolute'>
            <Head>
                <title>SysWeb</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar
                toggle={<SidebarToggle showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
                breadcrumbs={<Breadcrumb />}
            >
                <button onClick={() => setShowModal(true)} className="py-2 px-3 mr-2 rounded-md text-slate-800 hover:bg-slate-100">Filtros</button>
            </Navbar>

            <div className="flex absolute flex-col h-fit min-h-screen w-full lg:pl-72 bg-gray-100 top-0 pt-16">
                <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} name={name} />
                {children}
            </div>
        </div>


    );
};

export default Layout;
