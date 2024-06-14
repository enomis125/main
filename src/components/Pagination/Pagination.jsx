// components/PaginationComponent.js
import React from "react";
import { Pagination } from "@nextui-org/react";
import {useTranslations} from 'next-intl';

const PaginationComponent = ({ page, totalItems, rowsPerPage, onChangePage, onChangeRowsPerPage }) => {
    const t = useTranslations('Index');

    return (
        <div className="flex flex-row items-center">
            <Pagination
                isCompact
                showControls
                color="primary"
                variant="flat"
                page={page}
                total={Math.ceil(totalItems / rowsPerPage)}
                onChange={onChangePage}
                className="mx-5"
            />
            <div>
                <span className="text-sm text-black">{t("pagination.pageRecords")}</span>
                <select
                    value={rowsPerPage}
                    onChange={onChangeRowsPerPage}
                    className="ml-2 py-1 px-2 border rounded bg-transparent text-sm text-default-600 mx-5"
                >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div className="ml-5 mr-10 text-black">
                {totalItems > 0
                    ? `${(page - 1) * rowsPerPage + 1}-${Math.min(
                        page * rowsPerPage,
                        totalItems
                    )} ${t("pagination.of")} ${totalItems}`
                    : t("pagination.noRecords")}
            </div>
        </div>
    );
};

export default PaginationComponent;
