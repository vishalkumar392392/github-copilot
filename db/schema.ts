import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    originalUrl: text('original_url').notNull(),
    userId: text('user_id').notNull(),
    clicks: integer('clicks').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [index('links_user_id_idx').on(t.userId)],
);

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
