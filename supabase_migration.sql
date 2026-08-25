-- ============================================================
-- BIJOUTERIE SUPABASE MIGRATION v2
-- Run this in Supabase SQL Editor.
-- The schema (id TEXT, JSONB columns) is already correct.
-- This script only drops FK constraints and disables RLS.
-- ============================================================


-- ── STEP 1: Drop foreign key constraints ──────────────────────
-- The app syncs all tables in parallel (no guaranteed order).
-- FK constraints cause 409 Conflict when a child row is written
-- before its parent exists. The app manages referential integrity.

ALTER TABLE IF EXISTS sale_invoices       DROP CONSTRAINT IF EXISTS sale_invoices_worker_id_fkey;
ALTER TABLE IF EXISTS worker_advances     DROP CONSTRAINT IF EXISTS worker_advances_worker_id_fkey;
ALTER TABLE IF EXISTS worker_absences     DROP CONSTRAINT IF EXISTS worker_absences_worker_id_fkey;
ALTER TABLE IF EXISTS worker_payments     DROP CONSTRAINT IF EXISTS worker_payments_worker_id_fkey;

ALTER TABLE IF EXISTS commands            DROP CONSTRAINT IF EXISTS commands_workshop_id_fkey;
ALTER TABLE IF EXISTS commands            DROP CONSTRAINT IF EXISTS commands_cassie_type_id_fkey;
ALTER TABLE IF EXISTS commands            DROP CONSTRAINT IF EXISTS fk_commands_delivery;

ALTER TABLE IF EXISTS purchase_invoices   DROP CONSTRAINT IF EXISTS purchase_invoices_supplier_id_fkey;

ALTER TABLE IF EXISTS replacement_invoices DROP CONSTRAINT IF EXISTS replacement_invoices_worker_id_fkey;
ALTER TABLE IF EXISTS replacement_invoices DROP CONSTRAINT IF EXISTS replacement_invoices_delivery_id_fkey;
ALTER TABLE IF EXISTS replacement_invoices DROP CONSTRAINT IF EXISTS replacement_invoices_new_silver_type_id_fkey;
ALTER TABLE IF EXISTS replacement_invoices DROP CONSTRAINT IF EXISTS replacement_invoices_ret_silver_type_id_fkey;

ALTER TABLE IF EXISTS cassie_purchases    DROP CONSTRAINT IF EXISTS cassie_purchases_silver_type_id_fkey;
ALTER TABLE IF EXISTS melting_records     DROP CONSTRAINT IF EXISTS melting_records_target_silver_type_id_fkey;

ALTER TABLE IF EXISTS web_offers          DROP CONSTRAINT IF EXISTS web_offers_silver_type_id_fkey;
ALTER TABLE IF EXISTS web_special_offers  DROP CONSTRAINT IF EXISTS web_special_offers_silver_type_id_fkey;
ALTER TABLE IF EXISTS web_orders          DROP CONSTRAINT IF EXISTS web_orders_delivery_company_id_fkey;
ALTER TABLE IF EXISTS web_order_items     DROP CONSTRAINT IF EXISTS web_order_items_silver_type_id_fkey;
ALTER TABLE IF EXISTS web_order_items     DROP CONSTRAINT IF EXISTS web_order_items_offer_id_fkey;
ALTER TABLE IF EXISTS web_order_items     DROP CONSTRAINT IF EXISTS web_order_items_order_id_fkey;
ALTER TABLE IF EXISTS web_order_items     DROP CONSTRAINT IF EXISTS web_order_items_special_offer_id_fkey;

ALTER TABLE IF EXISTS silver_type_shapes  DROP CONSTRAINT IF EXISTS silver_type_shapes_silver_type_id_fkey;
ALTER TABLE IF EXISTS purchase_invoice_items DROP CONSTRAINT IF EXISTS purchase_invoice_items_silver_type_id_fkey;
ALTER TABLE IF EXISTS purchase_invoice_items DROP CONSTRAINT IF EXISTS purchase_invoice_items_invoice_id_fkey;
ALTER TABLE IF EXISTS sale_invoice_items  DROP CONSTRAINT IF EXISTS sale_invoice_items_silver_type_id_fkey;
ALTER TABLE IF EXISTS sale_invoice_items  DROP CONSTRAINT IF EXISTS sale_invoice_items_invoice_id_fkey;
ALTER TABLE IF EXISTS delivery_payment_actions DROP CONSTRAINT IF EXISTS delivery_payment_actions_delivery_id_fkey;
ALTER TABLE IF EXISTS client_payments     DROP CONSTRAINT IF EXISTS client_payments_client_id_fkey;
ALTER TABLE IF EXISTS client_recuperations DROP CONSTRAINT IF EXISTS client_recuperations_client_id_fkey;
ALTER TABLE IF EXISTS melting_cassie_purchases DROP CONSTRAINT IF EXISTS melting_cassie_purchases_melting_id_fkey;
ALTER TABLE IF EXISTS melting_cassie_purchases DROP CONSTRAINT IF EXISTS melting_cassie_purchases_purchase_id_fkey;


-- ── STEP 2: Disable RLS on all tables ─────────────────────────
-- Lets the anon key read/write without needing per-table policies.

ALTER TABLE IF EXISTS silver_types            DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS suppliers               DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchase_invoices       DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchase_invoice_items  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sale_invoices           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sale_invoice_items      DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workshops               DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS commands                DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workers                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS worker_advances         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS worker_absences         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS worker_payments         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS worker_payment_records  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deliveries              DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS delivery_payment_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS store_expenses          DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS debts                   DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS replacements            DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS replacement_invoices    DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clients                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS client_payments         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS client_recuperations    DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cassie_purchases        DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS melting_records         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS melting_cassie_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS silver_type_shapes      DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shapes                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS calibres                DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS metals                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_contacts            DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_offers              DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_special_offers      DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_delivery_companies  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_wilaya_prices       DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_orders              DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS web_order_items         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS store_settings          DISABLE ROW LEVEL SECURITY;


-- ── Done ──────────────────────────────────────────────────────
-- After running this, reload the app. Sync errors should be gone.


-- ============================================================
-- DEBT PAYMENT LEDGER (added for the Fournisseurs / Clients
-- payment-history screens). Run this once in the SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS debt_payments (
  id                TEXT PRIMARY KEY,
  party_type        TEXT NOT NULL,          -- 'supplier' | 'client'
  party_id          TEXT NOT NULL,
  party_name        TEXT,
  amount            NUMERIC NOT NULL DEFAULT 0,
  date              TEXT,
  method            TEXT NOT NULL DEFAULT 'cash',  -- 'cash' | 'silver' | 'gold' | 'other'
  silver_type_id    TEXT,
  silver_type_name  TEXT,
  price_per_gram    NUMERIC,
  weight            NUMERIC,
  invoice_id        TEXT,
  allocations       JSONB DEFAULT '[]'::jsonb,     -- [{ invoiceId, amount }]
  note              TEXT,
  created_at        TEXT
);

CREATE INDEX IF NOT EXISTS debt_payments_party_idx ON debt_payments (party_type, party_id);
CREATE INDEX IF NOT EXISTS debt_payments_date_idx  ON debt_payments (date);

ALTER TABLE IF EXISTS debt_payments DISABLE ROW LEVEL SECURITY;
