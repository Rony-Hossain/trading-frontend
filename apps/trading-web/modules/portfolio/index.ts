/**
 * @modules/portfolio - Module Entry Point
 * Exports all public APIs for the Portfolio module
 * Phase 3: Portfolio & Journal
 */

// Configuration
export { portfolioModuleConfig, portfolioModuleDependencies } from './module.config'

// Components
export { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
export { PortfolioList } from '@/components/portfolio/PortfolioList'
export { PortfolioRow } from '@/components/portfolio/PortfolioRow'
export { PositionDetailPanel } from '@/components/portfolio/PositionDetailPanel'
export { AdjustSafetyDialog } from '@/components/portfolio/AdjustSafetyDialog'
export { SellConfirmDialog } from '@/components/portfolio/SellConfirmDialog'
export { SetTargetDialog } from '@/components/portfolio/SetTargetDialog'

// Badges & Indicators
export { TradeModeIndicator } from '@/components/badges/TradeModeIndicator'

// Utils
export { exportPortfolioToCSV } from '@/lib/utils/export'

// Types
export type {
  Position,
  PositionsResponse,
  BuyRequest,
  SellRequest,
  ActionResponse,
} from '@/lib/types/contracts'
