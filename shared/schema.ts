import { pgTable, serial, text, timestamp, integer, jsonb, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  downloadLink: text('download_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  ccpNumber: text('ccp_number').notNull(),
  ccpName: text('ccp_name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone'),
  productId: integer('product_id').notNull().references(() => products.id),
  productTitle: text('product_title').notNull(),
  productPrice: integer('product_price').notNull(),
  total: integer('total').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  receiptImageUrl: text('receipt_image_url'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  customerEmail: text('customer_email').notNull(),
  productId: integer('product_id').notNull().references(() => products.id),
  productTitle: text('product_title').notNull(),
  downloadLink: text('download_link'),
  purchasedAt: timestamp('purchased_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;
