import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Eindeutiger Bezeichner dieser Website, z. B. "demo-cafe" - wird vom Frontend zum Abruf der Inhalte genutzt.',
      },
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Optional: die oeffentliche Domain dieser Website (z. B. demo-cafe.de).',
      },
    },
  ],
}
