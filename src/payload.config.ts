import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { Pages } from './collections/Pages'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tenants, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  // Seed runs at runtime on first init. Wrapped so a missing DB at build time
  // (when next build evaluates the config) can never break the build.
  onInit: async (payload) => {
    try {
      await seed(payload)
    } catch (err) {
      payload.logger.error(
        'Seed skipped or failed: ' + (err instanceof Error ? err.message : String(err)),
      )
    }
  },
  plugins: [
    multiTenantPlugin({
      collections: {
        // Pages get a `tenant` field. Access stays public (read) / auth-only
        // (write) via the collection itself, so external frontends can fetch.
        pages: {
          useTenantAccess: false,
        },
      },
      // Tenants collection keeps its own access rules (public read).
      useTenantsCollectionAccess: false,
      // For this setup every admin user can manage every tenant.
      // Refine later with roles if clients should only see their own site.
      userHasAccessToAllTenants: () => true,
      // Show the `tenant` field in the admin UI so it is easy to understand.
      debug: true,
    }),
  ],
})
