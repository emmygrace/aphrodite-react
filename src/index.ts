// Main exports
export { useChartRender, type UseChartRenderOptions, type UseChartRenderResult } from './hooks/useChartRender';
export { useOrientation, type UseOrientationOptions, type UseOrientationResult } from './hooks/useOrientation';
export { ChartWheel, type ChartWheelOptions, type Theme } from './components/ChartWheel';
export { buildIndexes } from './utils/buildIndexes';

// Re-export types from aphrodite for convenience
export type {
  VisualConfig,
  GlyphConfig,
} from '@gaia-tools/aphrodite';

// Re-export types from api-client
export type {
  RenderResponse,
  IndexesDTO,
  RingItemDTO,
  RingDTO,
  AspectPairDTO,
} from '@gaia-tools/coeus-api-client';

