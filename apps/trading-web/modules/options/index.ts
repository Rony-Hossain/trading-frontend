/**
 * @modules/options - Module Entry Point
 * Exports all public APIs for the Options module
 * Phase 4: Expert Surfaces
 */

// Configuration
export { optionsModuleConfig, optionsModuleDependencies } from './module.config'

// Components - lazy-loaded via dynamic imports
export { ExpertPanelOptions } from '@/components/expert'
