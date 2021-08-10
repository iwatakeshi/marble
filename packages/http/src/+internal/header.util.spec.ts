import { createServer, Server } from 'http';
import { getHeaderValueHead, normalizeHeaders } from './header.util';
import { closeServer, getServerAddress } from './server.util';
import { createHttpRequest } from './testing.util';

test('#getHeaderValueHead', () => {
  const headers = {
    'x-test-1': 'a',
    'x-test-2': ['b', 'c'],
  };
  const req = createHttpRequest({ headers });

  expect(getHeaderValueHead('x-test-1')(req)).toEqual('a');
  expect(getHeaderValueHead('x-test-2')(req)).toEqual('b');
  expect(getHeaderValueHead('x-test-3')(req)).toBeUndefined();
});

test('#getServerAddress', async () => {
  const server = await new Promise<Server>(res => {
    const server = createServer();
    server.listen(() => res(server));
  });

  expect(getServerAddress(server)).toEqual({
    port: expect.any(Number),
    host: '127.0.0.1',
  });

  await closeServer(server)();
});

test('#normalizeHeaders', () => {
  expect(normalizeHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ABC123',
    'x-test-1': 'test-123',
  })).toEqual({
    'content-type': 'application/json',
    'authorization': 'Bearer ABC123',
    'x-test-1': 'test-123',
  });
});
