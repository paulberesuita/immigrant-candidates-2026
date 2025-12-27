-- Migration: Add expanded fields for candidate full page
-- Run with: wrangler d1 execute DB --file=./migrations/002_add_expanded_fields.sql

-- Add new columns for expanded candidate information
ALTER TABLE candidates ADD COLUMN education TEXT;
ALTER TABLE candidates ADD COLUMN committees TEXT;
ALTER TABLE candidates ADD COLUMN leadership_roles TEXT;
ALTER TABLE candidates ADD COLUMN notable_legislation TEXT;
ALTER TABLE candidates ADD COLUMN career_before_politics TEXT;
ALTER TABLE candidates ADD COLUMN family_background TEXT;
ALTER TABLE candidates ADD COLUMN awards TEXT;
