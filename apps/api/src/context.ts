import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { Token } from './utils/jwt';

export async function createContext({ req }: CreateFastifyContextOptions) {
  async function getPayloadFromHeader() {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const token = req.headers.authorization.substring(7);
      const payload = await Token.verify(token)
        .then((d) => d.data)
        .catch(() => null);
      return payload;
    }
    return null;
  }
  const user = await getPayloadFromHeader();

  return {
    user,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
