"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Layout from "@/components/Layout/Layout";

export default function Home({ children }) {
  redirect('/homepage'); 
  

  return (
    <main className="light flex flex-col items-center min-h-screen ">
      <Layout>
        {children}
      </Layout>
    </main>
  );
}