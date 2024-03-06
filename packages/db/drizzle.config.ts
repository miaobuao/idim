import type { Config } from 'drizzle-kit'

import { join } from 'node:path'

export default {
  schema: './schema.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: join(__dirname, '../../apps/web/wrangler.toml'),
    dbName: 'idim',
  },
} satisfies Config
