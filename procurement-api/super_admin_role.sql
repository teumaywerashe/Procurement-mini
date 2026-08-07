-- Run this migration manually or via your migration tooling.
-- Safe: the role column is varchar(255), not a PG enum,
-- so adding 'SuperAdmin' as a valid value needs no DDL change.

-- 1. Update the column default to 'Admin' (was 'Vendor')
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Admin';

-- 2. (Optional) Promote a specific user to SuperAdmin:
-- UPDATE "users" SET role = 'SuperAdmin' WHERE email = 'super@example.com';
