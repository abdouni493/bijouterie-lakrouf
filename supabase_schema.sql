-- =====================================================================
-- BIJOUTERIE LAKROUF - FULL DATABASE SCHEMA (Supabase / PostgreSQL)
-- Generated from the production backup of 20-10-2026.
--
-- HOW TO USE: open the new project's Supabase Dashboard -> SQL Editor,
-- paste this whole file and click RUN. Run it ONCE on an empty project,
-- BEFORE the data files in supabase_data/.
--
-- Contents: 38 tables, primary keys / unique constraints, indexes,
-- the foreign key, policies, grants, and the 3 storage buckets with
-- their storage policies. Row Level Security on public tables is OFF,
-- exactly as it was on the old project.
-- =====================================================================

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


-- ---------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.calibres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.calibres OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.cassie_purchases (
    id text NOT NULL,
    client_name text NOT NULL,
    client_phone text,
    silver_type_id text,
    weight numeric(12,3) DEFAULT 0,
    total_price numeric(10,2) DEFAULT 0,
    date date DEFAULT CURRENT_DATE NOT NULL,
    is_melted boolean DEFAULT false
);


ALTER TABLE public.cassie_purchases OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.client_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.client_payments OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.client_recuperations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.client_recuperations OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.clients (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    note text,
    payments jsonb DEFAULT '[]'::jsonb,
    recuperations jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.clients OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.commands (
    id text NOT NULL,
    type text DEFAULT 'reparation'::text NOT NULL,
    client_name text NOT NULL,
    client_phone text,
    metal text,
    calibre text,
    initial_weight numeric(12,3) DEFAULT 0,
    workshop_id text,
    date date DEFAULT CURRENT_DATE NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    shape text,
    paid_amount numeric(10,2) DEFAULT 0,
    note text,
    payment_method text,
    cassie_type_id text,
    workshop_cassie_amount numeric(12,3) DEFAULT 0,
    final_weight numeric(12,3),
    workshop_price numeric(10,2),
    client_price numeric(10,2),
    price_per_gram numeric(10,2),
    end_date date,
    delivery_id text,
    delivery_price numeric(10,2),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.commands OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.debt_payments (
    id text NOT NULL,
    party_type text NOT NULL,
    party_id text NOT NULL,
    party_name text,
    amount numeric DEFAULT 0 NOT NULL,
    date text,
    method text DEFAULT 'cash'::text NOT NULL,
    silver_type_id text,
    silver_type_name text,
    price_per_gram numeric,
    weight numeric,
    invoice_id text,
    allocations jsonb DEFAULT '[]'::jsonb,
    note text,
    created_at text
);


ALTER TABLE public.debt_payments OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.debts (
    id text NOT NULL,
    name text NOT NULL,
    direction text DEFAULT 'given'::text NOT NULL,
    amount numeric(10,2) NOT NULL,
    amount_paid numeric(10,2) DEFAULT 0,
    remaining numeric(10,2),
    note text,
    is_paid boolean DEFAULT false,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.debts OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.deliveries (
    id text NOT NULL,
    full_name text NOT NULL,
    phone text,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    payment_history jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.deliveries OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.delivery_payment_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    method text DEFAULT 'cash'::text NOT NULL
);


ALTER TABLE public.delivery_payment_actions OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.melting_cassie_purchases (
    melting_id text NOT NULL,
    purchase_id text NOT NULL
);


ALTER TABLE public.melting_cassie_purchases OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.melting_records (
    id text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    loss numeric(12,3) DEFAULT 0,
    total_pre_weight numeric(12,3) DEFAULT 0,
    post_weight numeric(12,3) DEFAULT 0,
    total_price numeric(10,2) DEFAULT 0,
    price_per_gram_after numeric(10,2) DEFAULT 0,
    target_silver_type_id text,
    purchase_ids jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.melting_records OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.metals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.metals OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.purchase_invoice_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id text NOT NULL,
    silver_type_id text,
    shape text,
    weight numeric(12,3) DEFAULT 0,
    price_per_gram numeric(10,2) DEFAULT 0,
    labor_cost_per_gram numeric(10,2) DEFAULT 0,
    total_price numeric(10,2) DEFAULT 0,
    pricing_mode text DEFAULT 'weight'::text,
    quantity integer DEFAULT 0,
    price_per_piece numeric(10,2) DEFAULT 0
);


ALTER TABLE public.purchase_invoice_items OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.purchase_invoices (
    id text NOT NULL,
    supplier_id text,
    date date DEFAULT CURRENT_DATE NOT NULL,
    pay_cash numeric(10,2) DEFAULT 0,
    pay_cassie_silver_grams numeric(10,3) DEFAULT 0,
    pay_cassie_silver_price numeric(10,2) DEFAULT 0,
    pay_cassie_gold_grams numeric(10,3) DEFAULT 0,
    pay_cassie_gold_price numeric(10,2) DEFAULT 0,
    pay_total numeric(10,2) DEFAULT 0,
    is_debt boolean DEFAULT false,
    amount_paid numeric(10,2) DEFAULT 0,
    remaining numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    items jsonb DEFAULT '[]'::jsonb,
    payment jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.purchase_invoices OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.replacement_invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    type text DEFAULT 'exchange'::text NOT NULL,
    worker_id text,
    client_name text,
    client_phone text,
    ret_silver_type_id text,
    ret_shape text,
    ret_weight numeric(12,3) DEFAULT 0,
    ret_price_per_gram numeric(10,2) DEFAULT 0,
    ret_total_price numeric(10,2) DEFAULT 0,
    new_silver_type_id text,
    new_shape text,
    new_weight numeric(12,3),
    new_price_per_gram numeric(10,2),
    new_total_price numeric(10,2),
    buy_back_price_per_gram numeric(10,2),
    amount_difference numeric(10,2),
    amount_to_pay numeric(10,2),
    amount_to_refund numeric(10,2),
    note text,
    delivery_id text,
    delivery_price numeric(10,2),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.replacement_invoices OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.replacements (
    id text NOT NULL,
    date timestamp with time zone,
    type text,
    returned_item jsonb DEFAULT '{}'::jsonb,
    new_item jsonb DEFAULT '{}'::jsonb,
    buy_back_price_per_gram numeric DEFAULT 0,
    amount_difference numeric DEFAULT 0,
    amount_to_pay numeric DEFAULT 0,
    amount_to_refund numeric DEFAULT 0,
    client_name text DEFAULT ''::text,
    client_phone text DEFAULT ''::text
);


ALTER TABLE public.replacements OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.sale_invoice_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id text NOT NULL,
    silver_type_id text,
    shape text,
    weight numeric(12,3) DEFAULT 0,
    price_per_gram numeric(10,2) DEFAULT 0,
    total_price numeric(10,2) DEFAULT 0,
    is_ala_piece boolean DEFAULT false,
    quantity integer DEFAULT 0,
    price_per_piece numeric(10,2) DEFAULT 0
);


ALTER TABLE public.sale_invoice_items OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.sale_invoices (
    id text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    worker_id text,
    client_name text,
    client_phone text,
    is_debt boolean DEFAULT false,
    amount_paid numeric(10,2) DEFAULT 0,
    remaining numeric(10,2) DEFAULT 0,
    total numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    items jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.sale_invoices OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.shapes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.shapes OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.silver_type_shapes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    silver_type_id text NOT NULL,
    shape_name text NOT NULL,
    quantity numeric(12,3) DEFAULT 0
);


ALTER TABLE public.silver_type_shapes OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.silver_types (
    id text NOT NULL,
    name text NOT NULL,
    calibre text DEFAULT ''::text NOT NULL,
    initial_quantity numeric(12,3) DEFAULT 0,
    is_cassie boolean DEFAULT false,
    is_ala_piece boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    shapes jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.silver_types OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.store_expenses (
    id text NOT NULL,
    expense_name text NOT NULL,
    price numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    note text
);


ALTER TABLE public.store_expenses OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.store_settings (
    id text NOT NULL,
    logo_url text,
    store_name text DEFAULT ''::text NOT NULL,
    slogan text,
    contact text,
    phone text,
    address text,
    minimal_weight numeric(10,3) DEFAULT 0,
    silver_price_per_gram numeric(10,2) DEFAULT 0,
    web_badge_fr text,
    web_badge_ar text,
    web_hero_line1_fr text,
    web_hero_line1_ar text,
    web_hero_line2_fr text,
    web_hero_line2_ar text,
    web_hero_desc_fr text,
    web_hero_desc_ar text,
    web_cta1_fr text,
    web_cta1_ar text,
    web_cta2_fr text,
    web_cta2_ar text,
    web_featured_title_fr text,
    web_featured_title_ar text,
    web_view_all_cta_fr text,
    web_view_all_cta_ar text,
    web_story_tag_fr text,
    web_story_tag_ar text,
    web_story_title_fr text,
    web_story_title_ar text,
    web_story_desc_fr text,
    web_story_desc_ar text,
    web_stat1_val text,
    web_stat2_val text,
    web_stat3_val text,
    web_stat4_val text,
    web_stat1_label_fr text,
    web_stat1_label_ar text,
    web_stat2_label_fr text,
    web_stat2_label_ar text,
    web_stat3_label_fr text,
    web_stat3_label_ar text,
    web_stat4_label_fr text,
    web_stat4_label_ar text,
    web_benefit1_title_fr text,
    web_benefit1_desc_fr text,
    web_benefit1_title_ar text,
    web_benefit1_desc_ar text,
    web_benefit2_title_fr text,
    web_benefit2_desc_fr text,
    web_benefit2_title_ar text,
    web_benefit2_desc_ar text,
    web_benefit3_title_fr text,
    web_benefit3_desc_fr text,
    web_benefit3_title_ar text,
    web_benefit3_desc_ar text,
    web_benefit4_title_fr text,
    web_benefit4_desc_fr text,
    web_benefit4_title_ar text,
    web_benefit4_desc_ar text,
    web_personalized_title_fr text,
    web_personalized_title_ar text,
    web_personalized_desc_fr text,
    web_personalized_desc_ar text,
    web_personalized_cta_fr text,
    web_personalized_cta_ar text,
    web_marquee_items jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    shapes jsonb DEFAULT '[]'::jsonb,
    calibres jsonb DEFAULT '[]'::jsonb,
    metals jsonb DEFAULT '[]'::jsonb,
    web_content jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.store_settings OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.suppliers (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    address text
);


ALTER TABLE public.suppliers OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_contacts (
    id text NOT NULL,
    facebook text,
    instagram text,
    tiktok text,
    snapchat text,
    whatsapp text,
    telegram text,
    email text,
    phone text,
    address text,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.web_contacts OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_delivery_companies (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    wilayas jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.web_delivery_companies OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_offers (
    id text NOT NULL,
    name text NOT NULL,
    image_url text,
    silver_type_id text,
    calibre text,
    form text,
    pricing_mode text DEFAULT 'perGram'::text NOT NULL,
    weight numeric(12,3),
    price_per_gram numeric(10,2),
    total_price numeric(10,2) DEFAULT 0 NOT NULL,
    unit_price numeric(10,2),
    show_quantity boolean DEFAULT false,
    quantity integer DEFAULT 0,
    is_hidden boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    sizes text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.web_offers OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id text NOT NULL,
    offer_id text,
    special_offer_id text,
    name text NOT NULL,
    image_url text,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) DEFAULT 0 NOT NULL,
    total_price numeric(10,2) DEFAULT 0 NOT NULL,
    silver_type_id text,
    calibre text,
    form text,
    weight numeric(12,3)
);


ALTER TABLE public.web_order_items OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_orders (
    id text NOT NULL,
    order_number text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    client_full_name text NOT NULL,
    client_phone text NOT NULL,
    client_email text,
    wilaya_code integer NOT NULL,
    wilaya_name text NOT NULL,
    commune text NOT NULL,
    address text NOT NULL,
    delivery_company_id text,
    delivery_type text DEFAULT 'bureau'::text NOT NULL,
    delivery_price numeric(10,2) DEFAULT 0,
    subtotal numeric(10,2) DEFAULT 0,
    total numeric(10,2) DEFAULT 0,
    is_personalized boolean DEFAULT false,
    personalized_details jsonb,
    storage_deducted boolean DEFAULT false,
    finalized_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    items jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public.web_orders OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_special_offers (
    id text NOT NULL,
    name text NOT NULL,
    image_url text,
    silver_type_id text,
    calibre text,
    form text,
    pricing_mode text DEFAULT 'perGram'::text NOT NULL,
    weight numeric(12,3),
    price_per_gram numeric(10,2),
    original_price numeric(10,2) DEFAULT 0 NOT NULL,
    special_price numeric(10,2) DEFAULT 0 NOT NULL,
    unit_price numeric(10,2),
    show_quantity boolean DEFAULT false,
    quantity integer DEFAULT 0,
    is_hidden boolean DEFAULT false,
    is_active boolean DEFAULT true,
    start_date date,
    start_hour text,
    end_date date,
    end_hour text,
    created_at timestamp with time zone DEFAULT now(),
    sizes text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.web_special_offers OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.web_wilaya_prices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_company_id text NOT NULL,
    wilaya_code integer NOT NULL,
    wilaya_name text NOT NULL,
    communes jsonb DEFAULT '[]'::jsonb,
    to_bureau numeric(10,2) DEFAULT 0,
    to_home numeric(10,2) DEFAULT 0
);


ALTER TABLE public.web_wilaya_prices OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.worker_absences (
    id text NOT NULL,
    worker_id text NOT NULL,
    deduction numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.worker_absences OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.worker_advances (
    id text NOT NULL,
    worker_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.worker_advances OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.worker_payment_records (
    id text NOT NULL,
    worker_id text,
    amount numeric DEFAULT 0,
    date timestamp with time zone
);


ALTER TABLE public.worker_payment_records OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.worker_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    worker_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.worker_payments OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.workers (
    id text NOT NULL,
    full_name text NOT NULL,
    phone text,
    address text,
    payment_type text DEFAULT 'monthly'::text NOT NULL,
    salary numeric(10,2) DEFAULT 0,
    username text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.workers OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.workshops (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    address text
);


ALTER TABLE public.workshops OWNER TO postgres;


-- ---------------------------------------------------------------------
-- 2. PRIMARY KEYS / UNIQUE CONSTRAINTS
-- ---------------------------------------------------------------------

DO $do$ BEGIN
  ALTER TABLE ONLY public.calibres
      ADD CONSTRAINT calibres_name_key UNIQUE (name);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.calibres
      ADD CONSTRAINT calibres_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.cassie_purchases
      ADD CONSTRAINT cassie_purchases_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.client_payments
      ADD CONSTRAINT client_payments_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.client_recuperations
      ADD CONSTRAINT client_recuperations_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.clients
      ADD CONSTRAINT clients_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.commands
      ADD CONSTRAINT commands_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.debt_payments
      ADD CONSTRAINT debt_payments_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.debts
      ADD CONSTRAINT debts_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.deliveries
      ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.delivery_payment_actions
      ADD CONSTRAINT delivery_payment_actions_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.melting_cassie_purchases
      ADD CONSTRAINT melting_cassie_purchases_pkey PRIMARY KEY (melting_id, purchase_id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.melting_records
      ADD CONSTRAINT melting_records_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.metals
      ADD CONSTRAINT metals_name_key UNIQUE (name);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.metals
      ADD CONSTRAINT metals_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.purchase_invoice_items
      ADD CONSTRAINT purchase_invoice_items_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.purchase_invoices
      ADD CONSTRAINT purchase_invoices_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.replacement_invoices
      ADD CONSTRAINT replacement_invoices_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.replacements
      ADD CONSTRAINT replacements_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.sale_invoice_items
      ADD CONSTRAINT sale_invoice_items_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.sale_invoices
      ADD CONSTRAINT sale_invoices_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.shapes
      ADD CONSTRAINT shapes_name_key UNIQUE (name);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.shapes
      ADD CONSTRAINT shapes_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.silver_type_shapes
      ADD CONSTRAINT silver_type_shapes_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.silver_type_shapes
      ADD CONSTRAINT silver_type_shapes_silver_type_id_shape_name_key UNIQUE (silver_type_id, shape_name);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.silver_types
      ADD CONSTRAINT silver_types_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.store_expenses
      ADD CONSTRAINT store_expenses_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.store_settings
      ADD CONSTRAINT store_settings_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.suppliers
      ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_contacts
      ADD CONSTRAINT web_contacts_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_delivery_companies
      ADD CONSTRAINT web_delivery_companies_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_offers
      ADD CONSTRAINT web_offers_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_order_items
      ADD CONSTRAINT web_order_items_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_orders
      ADD CONSTRAINT web_orders_order_number_key UNIQUE (order_number);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_orders
      ADD CONSTRAINT web_orders_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_special_offers
      ADD CONSTRAINT web_special_offers_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_wilaya_prices
      ADD CONSTRAINT web_wilaya_prices_delivery_company_id_wilaya_code_key UNIQUE (delivery_company_id, wilaya_code);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_wilaya_prices
      ADD CONSTRAINT web_wilaya_prices_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.worker_absences
      ADD CONSTRAINT worker_absences_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.worker_advances
      ADD CONSTRAINT worker_advances_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.worker_payment_records
      ADD CONSTRAINT worker_payment_records_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.worker_payments
      ADD CONSTRAINT worker_payments_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.workers
      ADD CONSTRAINT workers_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.workers
      ADD CONSTRAINT workers_username_key UNIQUE (username);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  ALTER TABLE ONLY public.workshops
      ADD CONSTRAINT workshops_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;


-- ---------------------------------------------------------------------
-- 3. INDEXES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS debt_payments_date_idx ON public.debt_payments USING btree (date);

CREATE INDEX IF NOT EXISTS debt_payments_party_idx ON public.debt_payments USING btree (party_type, party_id);

CREATE INDEX IF NOT EXISTS idx_client_payments_client ON public.client_payments USING btree (client_id);

CREATE INDEX IF NOT EXISTS idx_commands_status ON public.commands USING btree (status);

CREATE INDEX IF NOT EXISTS idx_commands_workshop ON public.commands USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS idx_delivery_actions_del ON public.delivery_payment_actions USING btree (delivery_id);

CREATE INDEX IF NOT EXISTS idx_purchase_items_inv ON public.purchase_invoice_items USING btree (invoice_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_inv ON public.sale_invoice_items USING btree (invoice_id);

CREATE INDEX IF NOT EXISTS idx_silver_type_shapes_st ON public.silver_type_shapes USING btree (silver_type_id);

CREATE INDEX IF NOT EXISTS idx_web_order_items_order ON public.web_order_items USING btree (order_id);

CREATE INDEX IF NOT EXISTS idx_web_orders_created ON public.web_orders USING btree (created_at);

CREATE INDEX IF NOT EXISTS idx_web_orders_status ON public.web_orders USING btree (status);

CREATE INDEX IF NOT EXISTS idx_worker_advances_worker ON public.worker_advances USING btree (worker_id);


-- ---------------------------------------------------------------------
-- 4. FOREIGN KEYS
-- ---------------------------------------------------------------------

DO $do$ BEGIN
  ALTER TABLE ONLY public.web_wilaya_prices
      ADD CONSTRAINT web_wilaya_prices_delivery_company_id_fkey FOREIGN KEY (delivery_company_id) REFERENCES public.web_delivery_companies(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;


-- ---------------------------------------------------------------------
-- 5. POLICIES (inactive while RLS is disabled - kept as on the old project)
-- ---------------------------------------------------------------------

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.calibres USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.cassie_purchases USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.client_payments USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.client_recuperations USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.clients USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.commands USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.debts USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.deliveries USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.delivery_payment_actions USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.melting_cassie_purchases USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.melting_records USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.metals USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.purchase_invoice_items USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.purchase_invoices USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.replacement_invoices USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.replacements USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.sale_invoice_items USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.sale_invoices USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.shapes USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.silver_type_shapes USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.silver_types USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.store_expenses USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.store_settings USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.suppliers USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_contacts USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_delivery_companies USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_offers USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_order_items USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_orders USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_special_offers USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.web_wilaya_prices USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.worker_absences USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.worker_advances USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.worker_payment_records USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.worker_payments USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.workers USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

DO $do$ BEGIN
  CREATE POLICY allow_all ON public.workshops USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object OR duplicate_table OR invalid_table_definition THEN NULL;
END $do$;

-- Row Level Security disabled on every app table (same as old project)
ALTER TABLE public.calibres DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cassie_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_recuperations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.commands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_payment_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.melting_cassie_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.melting_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.metals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_invoice_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.replacement_invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.replacements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_invoice_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shapes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.silver_type_shapes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.silver_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_delivery_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_special_offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_wilaya_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_absences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_advances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_payment_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops DISABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 6. GRANTS
-- ---------------------------------------------------------------------

GRANT ALL ON TABLE public.calibres TO anon;
GRANT ALL ON TABLE public.calibres TO authenticated;
GRANT ALL ON TABLE public.calibres TO service_role;

GRANT ALL ON TABLE public.cassie_purchases TO anon;
GRANT ALL ON TABLE public.cassie_purchases TO authenticated;
GRANT ALL ON TABLE public.cassie_purchases TO service_role;

GRANT ALL ON TABLE public.client_payments TO anon;
GRANT ALL ON TABLE public.client_payments TO authenticated;
GRANT ALL ON TABLE public.client_payments TO service_role;

GRANT ALL ON TABLE public.client_recuperations TO anon;
GRANT ALL ON TABLE public.client_recuperations TO authenticated;
GRANT ALL ON TABLE public.client_recuperations TO service_role;

GRANT ALL ON TABLE public.clients TO anon;
GRANT ALL ON TABLE public.clients TO authenticated;
GRANT ALL ON TABLE public.clients TO service_role;

GRANT ALL ON TABLE public.commands TO anon;
GRANT ALL ON TABLE public.commands TO authenticated;
GRANT ALL ON TABLE public.commands TO service_role;

GRANT ALL ON TABLE public.debt_payments TO anon;
GRANT ALL ON TABLE public.debt_payments TO authenticated;
GRANT ALL ON TABLE public.debt_payments TO service_role;

GRANT ALL ON TABLE public.debts TO anon;
GRANT ALL ON TABLE public.debts TO authenticated;
GRANT ALL ON TABLE public.debts TO service_role;

GRANT ALL ON TABLE public.deliveries TO anon;
GRANT ALL ON TABLE public.deliveries TO authenticated;
GRANT ALL ON TABLE public.deliveries TO service_role;

GRANT ALL ON TABLE public.delivery_payment_actions TO anon;
GRANT ALL ON TABLE public.delivery_payment_actions TO authenticated;
GRANT ALL ON TABLE public.delivery_payment_actions TO service_role;

GRANT ALL ON TABLE public.melting_cassie_purchases TO anon;
GRANT ALL ON TABLE public.melting_cassie_purchases TO authenticated;
GRANT ALL ON TABLE public.melting_cassie_purchases TO service_role;

GRANT ALL ON TABLE public.melting_records TO anon;
GRANT ALL ON TABLE public.melting_records TO authenticated;
GRANT ALL ON TABLE public.melting_records TO service_role;

GRANT ALL ON TABLE public.metals TO anon;
GRANT ALL ON TABLE public.metals TO authenticated;
GRANT ALL ON TABLE public.metals TO service_role;

GRANT ALL ON TABLE public.purchase_invoice_items TO anon;
GRANT ALL ON TABLE public.purchase_invoice_items TO authenticated;
GRANT ALL ON TABLE public.purchase_invoice_items TO service_role;

GRANT ALL ON TABLE public.purchase_invoices TO anon;
GRANT ALL ON TABLE public.purchase_invoices TO authenticated;
GRANT ALL ON TABLE public.purchase_invoices TO service_role;

GRANT ALL ON TABLE public.replacement_invoices TO anon;
GRANT ALL ON TABLE public.replacement_invoices TO authenticated;
GRANT ALL ON TABLE public.replacement_invoices TO service_role;

GRANT ALL ON TABLE public.replacements TO anon;
GRANT ALL ON TABLE public.replacements TO authenticated;
GRANT ALL ON TABLE public.replacements TO service_role;

GRANT ALL ON TABLE public.sale_invoice_items TO anon;
GRANT ALL ON TABLE public.sale_invoice_items TO authenticated;
GRANT ALL ON TABLE public.sale_invoice_items TO service_role;

GRANT ALL ON TABLE public.sale_invoices TO anon;
GRANT ALL ON TABLE public.sale_invoices TO authenticated;
GRANT ALL ON TABLE public.sale_invoices TO service_role;

GRANT ALL ON TABLE public.shapes TO anon;
GRANT ALL ON TABLE public.shapes TO authenticated;
GRANT ALL ON TABLE public.shapes TO service_role;

GRANT ALL ON TABLE public.silver_type_shapes TO anon;
GRANT ALL ON TABLE public.silver_type_shapes TO authenticated;
GRANT ALL ON TABLE public.silver_type_shapes TO service_role;

GRANT ALL ON TABLE public.silver_types TO anon;
GRANT ALL ON TABLE public.silver_types TO authenticated;
GRANT ALL ON TABLE public.silver_types TO service_role;

GRANT ALL ON TABLE public.store_expenses TO anon;
GRANT ALL ON TABLE public.store_expenses TO authenticated;
GRANT ALL ON TABLE public.store_expenses TO service_role;

GRANT ALL ON TABLE public.store_settings TO anon;
GRANT ALL ON TABLE public.store_settings TO authenticated;
GRANT ALL ON TABLE public.store_settings TO service_role;

GRANT ALL ON TABLE public.suppliers TO anon;
GRANT ALL ON TABLE public.suppliers TO authenticated;
GRANT ALL ON TABLE public.suppliers TO service_role;

GRANT ALL ON TABLE public.web_contacts TO anon;
GRANT ALL ON TABLE public.web_contacts TO authenticated;
GRANT ALL ON TABLE public.web_contacts TO service_role;

GRANT ALL ON TABLE public.web_delivery_companies TO anon;
GRANT ALL ON TABLE public.web_delivery_companies TO authenticated;
GRANT ALL ON TABLE public.web_delivery_companies TO service_role;

GRANT ALL ON TABLE public.web_offers TO anon;
GRANT ALL ON TABLE public.web_offers TO authenticated;
GRANT ALL ON TABLE public.web_offers TO service_role;

GRANT ALL ON TABLE public.web_order_items TO anon;
GRANT ALL ON TABLE public.web_order_items TO authenticated;
GRANT ALL ON TABLE public.web_order_items TO service_role;

GRANT ALL ON TABLE public.web_orders TO anon;
GRANT ALL ON TABLE public.web_orders TO authenticated;
GRANT ALL ON TABLE public.web_orders TO service_role;

GRANT ALL ON TABLE public.web_special_offers TO anon;
GRANT ALL ON TABLE public.web_special_offers TO authenticated;
GRANT ALL ON TABLE public.web_special_offers TO service_role;

GRANT ALL ON TABLE public.web_wilaya_prices TO anon;
GRANT ALL ON TABLE public.web_wilaya_prices TO authenticated;
GRANT ALL ON TABLE public.web_wilaya_prices TO service_role;

GRANT ALL ON TABLE public.worker_absences TO anon;
GRANT ALL ON TABLE public.worker_absences TO authenticated;
GRANT ALL ON TABLE public.worker_absences TO service_role;

GRANT ALL ON TABLE public.worker_advances TO anon;
GRANT ALL ON TABLE public.worker_advances TO authenticated;
GRANT ALL ON TABLE public.worker_advances TO service_role;

GRANT ALL ON TABLE public.worker_payment_records TO anon;
GRANT ALL ON TABLE public.worker_payment_records TO authenticated;
GRANT ALL ON TABLE public.worker_payment_records TO service_role;

GRANT ALL ON TABLE public.worker_payments TO anon;
GRANT ALL ON TABLE public.worker_payments TO authenticated;
GRANT ALL ON TABLE public.worker_payments TO service_role;

GRANT ALL ON TABLE public.workers TO anon;
GRANT ALL ON TABLE public.workers TO authenticated;
GRANT ALL ON TABLE public.workers TO service_role;

GRANT ALL ON TABLE public.workshops TO anon;
GRANT ALL ON TABLE public.workshops TO authenticated;
GRANT ALL ON TABLE public.workshops TO service_role;


-- ---------------------------------------------------------------------
-- 7. STORAGE BUCKETS + STORAGE POLICIES
-- ---------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('store-logos',        'store-logos',        true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('web-offers',         'web-offers',         true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('web-special-offers', 'web-special-offers', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Authenticated delete store-logos" ON storage.objects;
  CREATE POLICY "Authenticated delete store-logos" ON storage.objects FOR DELETE USING ((bucket_id = 'store-logos'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Authenticated delete store-logos';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Authenticated delete web-offers" ON storage.objects;
  CREATE POLICY "Authenticated delete web-offers" ON storage.objects FOR DELETE USING ((bucket_id = 'web-offers'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Authenticated delete web-offers';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Authenticated delete web-special-offers" ON storage.objects;
  CREATE POLICY "Authenticated delete web-special-offers" ON storage.objects FOR DELETE USING ((bucket_id = 'web-special-offers'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Authenticated delete web-special-offers';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Authenticated upload store-logos" ON storage.objects;
  CREATE POLICY "Authenticated upload store-logos" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'store-logos'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Authenticated upload store-logos';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Authenticated upload web-offers" ON storage.objects;
  CREATE POLICY "Authenticated upload web-offers" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'web-offers'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Authenticated upload web-offers';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Authenticated upload web-special-offers" ON storage.objects;
  CREATE POLICY "Authenticated upload web-special-offers" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'web-special-offers'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Authenticated upload web-special-offers';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Public read store-logos" ON storage.objects;
  CREATE POLICY "Public read store-logos" ON storage.objects FOR SELECT USING ((bucket_id = 'store-logos'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Public read store-logos';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Public read web-offers" ON storage.objects;
  CREATE POLICY "Public read web-offers" ON storage.objects FOR SELECT USING ((bucket_id = 'web-offers'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Public read web-offers';
END $do$;

DO $do$ BEGIN
  DROP POLICY IF EXISTS "Public read web-special-offers" ON storage.objects;
  CREATE POLICY "Public read web-special-offers" ON storage.objects FOR SELECT USING ((bucket_id = 'web-special-offers'::text));
EXCEPTION WHEN insufficient_privilege THEN
  RAISE WARNING 'Could not create storage policy %, create it from Dashboard -> Storage -> Policies', 'Public read web-special-offers';
END $do$;


NOTIFY pgrst, 'reload schema';
