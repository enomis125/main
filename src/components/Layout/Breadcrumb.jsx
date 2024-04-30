"use client"
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";
export default function Breadcrumb() {
    const breadcrumbs = usePathname().split("/").filter((x) => x !== "");
    return (
        <Breadcrumbs maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={2}
        >
            {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                    key={index}
                    //color={(index == breadcrumbs.length - 1 ? "primary" : "foreground")}
                    href={`/${breadcrumbs.slice(0, index + 1).join("/")}`}
                >
                    {breadcrumb.toUpperCase()}
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
}

