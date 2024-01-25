export interface IIndexResponse<T> {
  data: T[];
  count: number;
}

export type Pagination = {
  page: number;
  perPage: number;
  startIndex: number;
  endIndex: number;
};
