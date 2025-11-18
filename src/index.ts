// React hooks (React-specific)
export { useChartRender, type UseChartRenderOptions, type UseChartRenderResult } from './hooks/useChartRender';
export { useOrientation, type UseOrientationOptions, type UseOrientationResult } from './hooks/useOrientation';

// Re-export ChartWheel from aphrodite-core (framework-agnostic)
export { ChartWheel, type ChartWheelOptions, type Theme } from '@gaia-tools/aphrodite-core';

// Re-export buildIndexes from coeus-api-client
export { buildIndexes } from '@gaia-tools/coeus-api-client';

// Re-export types from aphrodite-core for convenience
export type {
  VisualConfig,
  GlyphConfig,
} from '@gaia-tools/aphrodite-core';

// Re-export types from coeus-api-client
export type {
  RenderResponse,
  IndexesDTO,
  RingItemDTO,
  RingDTO,
  AspectPairDTO,
} from '@gaia-tools/coeus-api-client';

