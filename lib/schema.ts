import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const locations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pdfFiles = pgTable('pdf_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: varchar('mime_type', { length: 255 }).notNull(),
  uploadedBy: varchar('uploaded_by', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: varchar('action', { length: 255 }).notNull(), // e.g., 'UPLOAD', 'DELETE', 'UPDATE'
  entity: varchar('entity', { length: 255 }).notNull(), // e.g., 'pdf', 'location'
  entityId: uuid('entity_id').notNull(),
  performedBy: varchar('performed_by', { length: 255 }).notNull(),
  performedAt: timestamp('performed_at').defaultNow().notNull(),
  metadata: jsonb('metadata'),
});
