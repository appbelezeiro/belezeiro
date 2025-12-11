// ============================================================================
// LIB QUERY - Barrel exports
// ============================================================================

export { createQueryClient, getQueryClient, resetQueryClient } from './query-client';

export {
  defaultQueryOptions,
  alwaysFreshOptions,
  rarelyChangesOptions,
  staticDataOptions,
  STALE_TIME,
  GC_TIME,
  RETRY_COUNT,
} from './default-options';
