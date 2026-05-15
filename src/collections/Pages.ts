import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant'],
  },
  access: {
    // Pages are public so external website frontends can fetch them via the API.
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'URL-Pfad dieser Seite, z. B. "home" fuer die Startseite oder "about".',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Grosse Ueberschrift oben auf der Seite.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description: 'Haupttext der Seite.',
      },
    },
  ],
}
