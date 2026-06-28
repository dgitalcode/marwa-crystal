-- Add SUPER_ADMIN role for admin management access control
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
