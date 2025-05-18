interface PaginatorInput {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatorMeta {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export function paginator({
  page,
  limit,
  total,
}: PaginatorInput): PaginatorMeta {
  const lastPage = Math.ceil(total / limit);
  return { page, limit, total, lastPage };
}
