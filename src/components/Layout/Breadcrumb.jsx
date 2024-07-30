'use client'
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const breadcrumbs = usePathname().split("/").filter((x) => x !== "");

    // Função para formatar os nomes dos breadcrumbs
    const formatBreadcrumbName = (name) => {
        return name.replace(/_/g, ' '); // Substitui todos os '_' por espaços em branco
    };

    return (
        <Breadcrumbs maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={2}>
            {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                    key={index}
                    href={`/${breadcrumbs.slice(0, index + 1).join("/")}`}
                >
                    {formatBreadcrumbName(breadcrumb).toUpperCase()}
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
}
