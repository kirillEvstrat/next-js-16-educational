"use client";
import { Button, Pagination } from "@heroui/react";

type Props = {
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  setPageSize: (pageSize: number) => void;
};

export function PaginationComponent({
  page,
  setPage,
  itemsPerPage,
  totalItems,
  setPageSize,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageSizes = [3, 6, 12];

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <Pagination className="w-screen sticky bottom-0 mt-auto border-accent/40 border-t px-6 py-4 bg-white mx-[calc(50%-50vw)]">
      <Pagination.Summary>
        Showing {startItem}-{endItem} of {totalItems} results
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page === 1}
            onPress={() => setPage(page - 1)}
          >
            <Pagination.PreviousIcon />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page === totalPages}
            onPress={() => setPage(page + 1)}
          >
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
      <div className="flex gap-2">
        {pageSizes.map((size) => (
          <Button
            key={size}
            onClick={() => setPageSize(size)}
            variant={itemsPerPage === size ? "primary" : "secondary"}
          >
            {size}
          </Button>
        ))}
      </div>
    </Pagination>
  );
}
