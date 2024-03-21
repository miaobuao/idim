import type { Config } from 'drizzle-kit'

import { join } from 'node:path'
import process from 'node:process'

export default {
  schema: './schema.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: join(__dirname, '../../wrangler.toml'),
    dbName: process.env.DB_MODE === 'dev' ? 'idim-prev' : 'idim-prod',
  },
} satisfies Config
