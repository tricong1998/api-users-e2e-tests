export enum DBCollectionName {
  USERS = 'users',
  POINT_HISTORY = 'point_history',
}

export const TOTAL_COUNT_HEADER_NAME = 'x-total-count';
export const NEXT_PAGE_HEADER_NAME = 'x-next-page';
export const PAGE_HEADER_NAME = 'x-page';
export const PAGES_COUNT_HEADER_NAME = 'x-pages-count';
export const PER_PAGE_HEADER_NAME = 'x-per-page';
export const CORS_EXPOSED_HEADERS =
  `${NEXT_PAGE_HEADER_NAME},${PAGE_HEADER_NAME},${PAGES_COUNT_HEADER_NAME},` +
  `${PER_PAGE_HEADER_NAME},${TOTAL_COUNT_HEADER_NAME}`;

export const PAGINATION = {
  DEFAULT_PER_PAGE: 20,
  DEFAULT_PAGE: 1,
};

export enum MongoSortOption {
  ASC = 'asc',
  DESC = 'desc',
}
