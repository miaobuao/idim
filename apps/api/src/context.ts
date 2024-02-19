import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

function decodeAndVerifyJwtToken(token: string) {
  return token;
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  async function getUserFromHeader() {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const user = await decodeAndVerifyJwtToken(
        req.headers.authorization.substring(6)
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    user,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
