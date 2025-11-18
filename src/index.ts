// React hooks (React-specific)
export { useChartRender, type UseChartRenderOptions, type UseChartRenderResult } from './hooks/useChartRender';
export { useOrientation, type UseOrientationOptions, type UseOrientationResult } from './hooks/useOrientation';

// Re-export ChartWheel from aphrodite-core (framework-agnostic)
export { ChartWheel, type ChartWheelOptions, type Theme } from '@gaia-tools/aphrodite-core';

// Re-export buildIndexes from iris-core
export { buildIndexes } from '@gaia-tools/iris-core';

// Re-export types from aphrodite-core for convenience
export type {
  VisualConfig,
  GlyphConfig,
} from '@gaia-tools/aphrodite-core';

// Re-export types from iris-core
export type {
  RenderResponse,
  IndexesDTO,
  RingItemDTO,
  RingDTO,
  AspectPairDTO,
} from '@gaia-tools/iris-core';

