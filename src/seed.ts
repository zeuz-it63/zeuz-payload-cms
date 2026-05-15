import type { Payload } from 'payload'

/**
 * Idempotent seed: creates two example tenants with a few pages each,
 * but only if there are no tenants yet. Runs on payload init.
 */
export const seed = async (payload: Payload): Promise<void> => {
  const existing = await payload.count({ collection: 'tenants' })
  if (existing.totalDocs > 0) {
    return
  }

  payload.logger.info('Seeding example tenants and pages...')

  const cafe = await payload.create({
    collection: 'tenants',
    data: { name: 'Demo Cafe', slug: 'demo-cafe', domain: '' },
  })

  const startup = await payload.create({
    collection: 'tenants',
    data: { name: 'Tech Startup', slug: 'tech-startup', domain: '' },
  })

  const pages = [
    {
      tenant: cafe.id,
      title: 'Startseite',
      slug: 'home',
      heading: 'Willkommen im Demo Cafe',
      body: 'Frischer Kaffee, hausgemachter Kuchen und gute Stimmung - mitten in der Stadt. Schau vorbei!',
    },
    {
      tenant: cafe.id,
      title: 'Ueber uns',
      slug: 'about',
      heading: 'Unsere Geschichte',
      body: 'Das Demo Cafe gibt es seit 2020. Wir roesten unseren Kaffee selbst und backen taeglich frisch.',
    },
    {
      tenant: startup.id,
      title: 'Startseite',
      slug: 'home',
      heading: 'Tech Startup GmbH',
      body: 'Wir bauen Software, die Unternehmen schneller macht. Modern, skalierbar, zuverlaessig.',
    },
    {
      tenant: startup.id,
      title: 'Leistungen',
      slug: 'services',
      heading: 'Was wir bieten',
      body: 'Beratung, Entwicklung und Betrieb - alles aus einer Hand. Von der Idee bis zum Launch.',
    },
  ]

  for (const page of pages) {
    await payload.create({ collection: 'pages', data: page })
  }

  payload.logger.info('Seeding done: 2 tenants, 4 pages.')
}
