import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  console.log('Starting E2E test suite...');
});

afterAll(async () => {
  console.log('E2E test suite completed.');
});
