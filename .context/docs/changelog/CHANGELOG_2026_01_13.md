# Changelog 2026-01-13

- Objetivo: alinhar o `DATABASE_URL` usado pela API local para apontar ao banco `cerberus_db`.
- Arquivos alterados: `apps/api/.env`.
- Impacto: migrações do Prisma passam a usar o banco local correto.
