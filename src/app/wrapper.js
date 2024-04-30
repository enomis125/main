// app/providers.tsx
'use client'
import { NextUIProvider } from '@nextui-org/react'
import { useIdle } from "@uidotdev/usehooks";
import { signOut } from "next-auth/react"
import { redirect, usePathname } from "next/navigation";


export function Providers({ children }) {

    const pathname = usePathname()

    if (pathname != "/login") {
        const idle = useIdle(15 * 60 * 1000) //15 * 60 * 1000
        if (idle) {
            signOut()
            redirect("/login")
        }
    }

    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}