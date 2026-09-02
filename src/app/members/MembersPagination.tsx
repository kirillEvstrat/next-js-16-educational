"use client";
import { PaginationComponent } from "@/components/Pagination";
import { useFilterParams } from "@/lib/hooks/useFilterParams";
import React from "react";

type Props = {
  totalCount: number;
};

export default function MembersPagination({ totalCount }: Props) {
  const { searchParams, commit } = useFilterParams();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 12);

  return (
    <PaginationComponent
      page={page}
      setPage={(p) => commit({ page: String(p) })}
      itemsPerPage={pageSize}
      totalItems={totalCount}
      setPageSize={(size) => commit({ pageSize: String(size), page: null })}
    />
  );
}
