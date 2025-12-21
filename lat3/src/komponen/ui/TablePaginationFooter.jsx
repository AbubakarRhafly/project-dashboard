export default function TablePaginationFooter({
    totalRows = 0,
    perPage = 5,
    startLabel = 0,
    endLabel = 0,
    page = 1,
    totalPages = 1,
    canPrev = false,
    canNext = false,
    onPrev,
    onNext,
}) {
    return (
        <div className="px-4 py-3 text-sm text-slate-600 border-t flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span>
                    Total data: <b>{totalRows}</b>
                </span>
                <span>
                    Menampilkan <b>{startLabel}</b>–<b>{endLabel}</b> dari <b>{totalRows}</b>
                </span>
            </div>

            {totalRows > perPage && (
                <div className="flex justify-between items-center">
                    <button
                        onClick={onPrev}
                        disabled={!canPrev}
                        className={`px-3 py-1 rounded-md border ${!canPrev ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"
                            }`}
                    >
                        Prev
                    </button>

                    <span>
                        Halaman <b>{page}</b> dari <b>{totalPages}</b>
                    </span>

                    <button
                        onClick={onNext}
                        disabled={!canNext}
                        className={`px-3 py-1 rounded-md border ${!canNext ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
