-- Promote existing admins so they retain full access after RBAC split
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE role = 'ADMIN';
