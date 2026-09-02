"use client";
import { useFilterParams } from "@/lib/hooks/useFilterParams";
import { Button, Card } from "@heroui/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function EmptyState() {
  const { resets, isPending } = useFilterParams();

  return (
    <div className="flex justify-center items-center h-full px-7 py-24">
      <Card className="w-full max-w-3xl mx-auto shadow-2xl rounded-2xl">
        <Card.Header className="flex flex-col items-center justify-center gap-5">
          <FaSearch size={48} />
          <h2>No results found</h2>
        </Card.Header>
        <Card.Content className="text-center text-muted">
          Try updating your filters or resetting them to see results.
        </Card.Content>
        <Card.Footer className="flex justify-center pb-24 pt-8">
          <Button onClick={resets} variant="primary" isPending={isPending}>
            {isPending ? "Resetting..." : "Reset Filters"}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
