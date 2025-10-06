/**
 * @modules/diagnostics - Module Entry Point
 * Exports all public APIs for the Diagnostics module
 * Phase 4: Expert Surfaces
 */

// Configuration
export { diagnosticsModuleConfig, diagnosticsModuleDependencies } from './module.config'

// Components - ExpertPanelDiagnostics lazy-loaded via dynamic imports
export { ExpertPanelDiagnostics } from '@/components/expert'
export { DiagnosticsChip } from '@/components/diagnostics/DiagnosticsChip'
