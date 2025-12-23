import { useEffect, useMemo, useState } from "react";

export function usePagination(data = [], { perPage = 5, initialPage = 1 } = {}) {
    const [page, setPage] = useState(initialPage);

    const totalRows = data?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalRows / perPage));

    useEffect(() => {
        setPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    const startIndex = (page - 1) * perPage;

    const pagedData = useMemo(() => {
        return (data ?? []).slice(startIndex, startIndex + perPage);
    }, [data, startIndex, perPage]);

    const startLabel = totalRows === 0 ? 0 : startIndex + 1;
    const endLabel =
        totalRows === 0 ? 0 : Math.min(startIndex + perPage, totalRows);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const prev = () => {
        if (canPrev) setPage((p) => p - 1);
    };

    const next = () => {
        if (canNext) setPage((p) => p + 1);
    };

    const goTo = (p) => {
        const safe = Math.min(Math.max(1, Number(p) || 1), totalPages);
        setPage(safe);
    };

    return {
        page,
        perPage,
        totalRows,
        totalPages,
        startIndex,
        startLabel,
        endLabel,
        pagedData,
        canPrev,
        canNext,
        prev,
        next,
        goTo,
        setPage,
    };
}
