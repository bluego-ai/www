import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/db/schema',
    dialect: 'postgresql',
    out: './src/migrations',
} satisfies Config;
