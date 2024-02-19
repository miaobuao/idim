import z from 'zod';

import { procedure, router } from '../trpc';

export default router({
  post: {
    create: procedure.input(z.object({})).mutation(() => ''),
  },
});
