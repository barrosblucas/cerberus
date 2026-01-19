# Changelog - 2026-01-18

## [0.1.0] - Sinapi Catalog Integration

### Added
- Integrated MongoDB for monthly Sinapi catalog storage.
- `SinapiModule`, `SinapiController`, `SinapiIngesterService`, and `SinapiProviderService` in backend.
- `MongoService` for shared MongoDB connection.
- New contracts for Sinapi items, filters, and details in `@repo/contracts`.
- `add-item` endpoint for budgets to link with Sinapi items.
- Global re-calculation logic for budgets when switching UF/Scenario.

### Modified
- `PrismaSchema`: Added `codigoSinapi` and `referenciaSinapi` to `ItemOrcamento`.
- `OrcamentosService`: Added `addSinapiItem` and `updateBudgetPrices`.
- Registered `SinapiModule` in `AppModule`.

### Infrastructure
- Added `mongodb` dependency to `apps/api`.
- Generated new Prisma client with added fields.
