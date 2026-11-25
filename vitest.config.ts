import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vite-plus'

export default defineConfig({
	plugins: [
		cloudflareTest(async () => ({
			config: true,
			miniflare: {
				bindings: {
					TEST_MIGRATIONS: await readD1Migrations('./migrations'),
					TURNSTILE_SECRET: 'test-turnstile-secret',
					ADMIN_EMAIL: 'admin@example.com',
					TEST_IPS: '198.51.100.250',
				},
			},
		})),
	],
})
