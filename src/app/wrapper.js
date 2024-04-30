// app/providers.tsx
'use client'
import { NextUIProvider } from '@nextui-org/react'
import { useIdle } from "@uidotdev/usehooks";
import { signOut } from "next-auth/react"
import { redirect, usePathname } from "next/navigation";

export function Providers({ children }) {
    const pathname = usePathname();
    const idle = useIdle(15 * 60 * 1000); // 15 minutes in milliseconds

    if (pathname !== "/login" && idle) {
        signOut();
        redirect("/login");
    }

    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    );
}
