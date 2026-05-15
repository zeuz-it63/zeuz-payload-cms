# ZeuZ Payload CMS - Multi-Tenant

Central headless CMS (Payload 3.84.1, Next.js 16, MongoDB) that manages content
for multiple websites. Each website is a "Tenant". External website frontends
fetch their content from this CMS via the public REST/GraphQL API.

## Collections
- **Users** - admin users (gets a `tenants` array field from the plugin)
- **Media** - uploaded files
- **Tenants** - one entry per managed website (name, slug, domain)
- **Pages** - content pages, each linked to a tenant (title, slug, heading, body)

## Environment variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string from the Dokploy MongoDB service |
| `PAYLOAD_SECRET` | Long random string used to sign JWT tokens |

## API for external frontends
- List a tenant's pages: `GET /api/pages?where[tenant][equals]=<tenantId>&depth=1`
- Look up a tenant by slug: `GET /api/tenants?where[slug][equals]=<slug>`

## Seed
On first start (empty database) the app creates 2 example tenants
("Demo Cafe", "Tech Startup") with a few pages each. Idempotent - runs only once.
