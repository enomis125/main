import Layout from "@/components/Layout/Layout";
import { getServerSession, } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);
    return (
        <Layout >
            <ToastContainer />
            {children}
        </Layout>
    )

}
