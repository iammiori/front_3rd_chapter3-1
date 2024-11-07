import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';

import { handlers } from './__mocks__/handlers';

/* msw */
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();

  vi.useFakeTimers();
});

beforeEach(() => {
  expect.hasAssertions();
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.useRealTimers();

  vi.resetAllMocks();
  server.close();
});
