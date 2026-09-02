import { useCallback, useTransition } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { UserFilters } from "../types";

const FILTER_COOKIE = "memberFilters";
const MAX_AGE = 60 * 60 * 24 * 30; // 1 day in seconds

const readCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

export const useFilterParams = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const commit = useCallback(
    (updates: Partial<Record<keyof UserFilters, string | null>>) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, values] of Object.entries(updates)) {
        if (values === null || values === "false") {
          params.delete(key);
        } else {
          params.set(key, values);
        }
      }

      const queryString = params.toString();
      document.cookie = `${FILTER_COOKIE}=${encodeURIComponent(queryString)}; max-age=${MAX_AGE}; path=/`;
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
      });
    },
    [searchParams, pathname, router],
  );

  const restore = useCallback(() => {
    const cookie = readCookie(FILTER_COOKIE);
    if (!cookie) return;
    const query = decodeURIComponent(cookie);
    startTransition(() => {
      router.replace(`${pathname}?${query}`);
    });
  }, [router, pathname]);

  const resets = useCallback(() => {
    document.cookie = `${FILTER_COOKIE}=; max-age=0; path=/`;
    startTransition(() => {
      router.replace(pathname);
    });
  }, [router, pathname]);

  return {
    commit,
    isPending,
    searchParams,
    pathname,
    restore,
    resets,
  };
};
