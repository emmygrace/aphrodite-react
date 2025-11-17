# @gaia-tools/aphrodite-react

React bindings and components for the `@gaia-tools/aphrodite` chart renderer.

## Overview

`@gaia-tools/aphrodite-react` provides React components and hooks for rendering astrological charts in React applications. It includes a data-fetching hook, a chart wheel component, and utilities for building chart indexes. The package is designed to work seamlessly with Next.js and supports both client-side and server-side rendering.

## Installation

```bash
npm install @gaia-tools/aphrodite-react @gaia-tools/aphrodite @gaia-tools/coeus-api-client react react-dom d3
```

### Peer Dependencies

This package requires the following peer dependencies:

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `@gaia-tools/aphrodite` ^0.1.0
- `d3` ^7.8.5

### Dependencies

- `@gaia-tools/coeus-api-client` - API client for fetching chart data

## Quick Start

### Using the Hook

```typescript
import { useChartRender } from '@gaia-tools/aphrodite-react';
import { ChartWheel } from '@gaia-tools/aphrodite-react/components';
import { createApiClient } from '@gaia-tools/coeus-api-client';

function ChartViewer({ instanceId }: { instanceId: string }) {
  const api = createApiClient('/api');
  const { data, indexes, isLoading, isError, error } = useChartRender(api, {
    instanceId,
  });

  if (isLoading) return <div>Loading chart...</div>;
  if (isError || !data || !indexes) {
    return <div>Error loading chart: {String(error)}</div>;
  }

  return <ChartWheel renderData={data} indexes={indexes} />;
}
```

### Using the Component Directly

```typescript
import { ChartWheel, buildIndexes } from '@gaia-tools/aphrodite-react';
import { RenderResponse } from '@gaia-tools/coeus-api-client';

function MyChart({ renderData }: { renderData: RenderResponse }) {
  const indexes = buildIndexes(renderData);

  return (
    <ChartWheel
      renderData={renderData}
      indexes={indexes}
      width={800}
      height={800}
      onItemClick={(item, ring) => {
        console.log('Item clicked:', item, ring);
      }}
      onAspectClick={(aspect) => {
        console.log('Aspect clicked:', aspect);
      }}
    />
  );
}
```

## API Reference

### Hooks

#### `useChartRender(apiClient, options)`

React hook for fetching and managing chart render data from the API.

```typescript
function useChartRender(
  apiClient: ApiClient,
  options: UseChartRenderOptions
): UseChartRenderResult
```

**Parameters:**

- `apiClient` - An `ApiClient` instance from `@gaia-tools/coeus-api-client`
- `options` - Configuration object:
  - `instanceId: string` - Chart instance ID to render (required)
  - `wheelIdOverride?: string` - Optional wheel ID override for rendering with a different wheel
  - `enabled?: boolean` - Whether to fetch data (default: `true`). Set to `false` to disable automatic fetching.

**Returns:** `UseChartRenderResult`

- `data: RenderResponse | null` - Chart render data from the API
- `indexes: IndexesDTO | null` - Pre-built lookup indexes for efficient data access
- `isLoading: boolean` - Whether the data is currently being fetched
- `isError: boolean` - Whether an error occurred during fetching
- `error: unknown` - Error object if an error occurred
- `refetch: () => void` - Function to manually refetch the chart data

**Example:**

```typescript
import { useChartRender } from '@gaia-tools/aphrodite-react';
import { createApiClient } from '@gaia-tools/coeus-api-client';

function ChartComponent({ instanceId }: { instanceId: string }) {
  const api = createApiClient(process.env.NEXT_PUBLIC_API_URL || '/api');
  
  const { data, indexes, isLoading, isError, error, refetch } = useChartRender(api, {
    instanceId,
    wheelIdOverride: undefined, // Optional
    enabled: true, // Optional, default true
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {String(error)}</div>;
  if (!data || !indexes) return null;

  return <ChartWheel renderData={data} indexes={indexes} />;
}
```

### Components

#### `ChartWheel`

React component that renders a chart wheel using the Aphrodite renderer.

```typescript
function ChartWheel(props: ChartWheelProps): JSX.Element
```

**Props:**

- `renderData: RenderResponse` - Chart data to render (required)
- `indexes: IndexesDTO` - Pre-built indexes for efficient lookups (required)
- `width?: number` - SVG width in pixels (default: `800`)
- `height?: number` - SVG height in pixels (default: `800`)
- `centerX?: number` - Center X coordinate (defaults to `width / 2`)
- `centerY?: number` - Center Y coordinate (defaults to `height / 2`)
- `rotationOffset?: number` - Rotation offset in degrees (default: `0`)
- `visualConfig?: VisualConfig` - Visual styling configuration (colors, ring sizes, etc.)
- `glyphConfig?: GlyphConfig` - Glyph configuration for signs, planets, and aspects
- `onItemClick?: (item: RingItemDTO, ring: RingDTO) => void` - Click handler for chart items (planets, houses, signs)
- `onAspectClick?: (aspect: AspectPairDTO) => void` - Click handler for aspect lines

**Example:**

```typescript
import { ChartWheel } from '@gaia-tools/aphrodite-react';
import { VisualConfig, GlyphConfig } from '@gaia-tools/aphrodite';

const customVisualConfig: VisualConfig = {
  ringWidth: 40,
  ringSpacing: 15,
  signColors: ['#FF6B6B', /* ... */],
  // ... other visual config
};

const customGlyphConfig: GlyphConfig = {
  glyphSize: 16,
  glyphFont: 'Georgia, serif',
  // ... other glyph config
};

function MyChart({ renderData, indexes }) {
  return (
    <ChartWheel
      renderData={renderData}
      indexes={indexes}
      width={1000}
      height={1000}
      rotationOffset={90}
      visualConfig={customVisualConfig}
      glyphConfig={customGlyphConfig}
      onItemClick={(item, ring) => {
        console.log('Clicked:', item.id, 'in ring:', ring.id);
      }}
      onAspectClick={(aspect) => {
        console.log('Aspect clicked:', aspect.id);
      }}
    />
  );
}
```

### Utilities

#### `buildIndexes(renderData)`

Utility function that builds lookup indexes from render data for efficient data access.

```typescript
function buildIndexes(renderData: RenderResponse): IndexesDTO
```

**Parameters:**

- `renderData: RenderResponse` - Chart render data from the API

**Returns:** `IndexesDTO` - Object containing lookup indexes:

- `ringById: Record<string, RingDTO>` - Lookup ring by ID
- `itemByRingAndId: Record<string, Record<string, RingItemDTO>>` - Lookup item by ring ID and item ID
- `aspectSetById: Record<string, AspectSetDTO>` - Lookup aspect set by ID
- `aspectById: Record<string, AspectPairDTO>` - Lookup aspect pair by ID
- `itemsByLogicalId: Record<string, { ringId: string; itemId: string }[]>` - Lookup items by logical ID
- `aspectsByObjectLogicalId: Record<string, string[]>` - Lookup aspect IDs by object logical ID

**Example:**

```typescript
import { buildIndexes } from '@gaia-tools/aphrodite-react';
import { RenderResponse } from '@gaia-tools/coeus-api-client';

function processChartData(renderData: RenderResponse) {
  const indexes = buildIndexes(renderData);
  
  // Access a specific planet
  const planetRing = indexes.ringById['planets'];
  const planetItem = indexes.itemByRingAndId['planets']?.['sun'];
  
  // Find all aspects for a planet
  const sunAspects = indexes.aspectsByObjectLogicalId['natal:planet:sun'] || [];
  
  return indexes;
}
```

## Type Definitions

### `UseChartRenderOptions`

```typescript
interface UseChartRenderOptions {
  instanceId: string;
  wheelIdOverride?: string;
  enabled?: boolean;
}
```

### `UseChartRenderResult`

```typescript
interface UseChartRenderResult {
  data: RenderResponse | null;
  indexes: IndexesDTO | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}
```

### `ChartWheelProps`

```typescript
interface ChartWheelProps {
  renderData: RenderResponse;
  indexes: IndexesDTO;
  width?: number;
  height?: number;
  centerX?: number;
  centerY?: number;
  rotationOffset?: number;
  visualConfig?: VisualConfig;
  glyphConfig?: GlyphConfig;
  onItemClick?: (item: RingItemDTO, ring: RingDTO) => void;
  onAspectClick?: (aspect: AspectPairDTO) => void;
}
```

### Re-exported Types

The package re-exports types from `@gaia-tools/aphrodite` and `@gaia-tools/coeus-api-client` for convenience:

```typescript
// From @gaia-tools/aphrodite
export type { VisualConfig, GlyphConfig };

// From @gaia-tools/coeus-api-client
export type {
  RenderResponse,
  IndexesDTO,
  RingItemDTO,
  RingDTO,
  AspectPairDTO,
};
```

## Usage Examples

### Next.js App Router (Server Components)

```typescript
// app/chart/[instanceId]/page.tsx
import { ChartWheel, buildIndexes } from '@gaia-tools/aphrodite-react';
import { createApiClient } from '@gaia-tools/coeus-api-client';

export default async function ChartPage({
  params,
}: {
  params: { instanceId: string };
}) {
  const api = createApiClient(process.env.BACKEND_URL || 'http://localhost:8000');
  
  // Fetch data on the server
  const renderData = await api.instances.render(params.instanceId);
  const indexes = buildIndexes(renderData);

  return (
    <div>
      <h1>Chart {params.instanceId}</h1>
      <ChartWheel renderData={renderData} indexes={indexes} />
    </div>
  );
}
```

### Next.js App Router (Client Components)

```typescript
// app/chart/[instanceId]/client.tsx
'use client';

import { useChartRender } from '@gaia-tools/aphrodite-react';
import { ChartWheel } from '@gaia-tools/aphrodite-react/components';
import { createApiClient } from '@gaia-tools/coeus-api-client';

export default function ChartClient({ instanceId }: { instanceId: string }) {
  const api = createApiClient('/api');
  const { data, indexes, isLoading, isError } = useChartRender(api, {
    instanceId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data || !indexes) return <div>Error loading chart</div>;

  return <ChartWheel renderData={data} indexes={indexes} />;
}
```

### Conditional Fetching

```typescript
function ChartWithToggle({ instanceId }: { instanceId: string }) {
  const [enabled, setEnabled] = useState(false);
  const api = createApiClient('/api');
  
  const { data, indexes, isLoading } = useChartRender(api, {
    instanceId,
    enabled, // Only fetch when enabled is true
  });

  return (
    <div>
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? 'Hide Chart' : 'Show Chart'}
      </button>
      {enabled && data && indexes && (
        <ChartWheel renderData={data} indexes={indexes} />
      )}
    </div>
  );
}
```

### Custom Styling

```typescript
import { ChartWheel } from '@gaia-tools/aphrodite-react';
import { VisualConfig, GlyphConfig } from '@gaia-tools/aphrodite';

const darkModeConfig: VisualConfig = {
  ringWidth: 35,
  ringSpacing: 12,
  backgroundColor: '#1a1a1a',
  strokeColor: '#ffffff',
  strokeWidth: 2,
  signColors: [
    '#ff6b6b', '#ffa07a', '#ffd700', '#98d8c8',
    '#ff6347', '#f0e68c', '#87ceeb', '#9370db',
    '#ffa500', '#2f4f4f', '#00ced1', '#ff69b4',
  ],
  // ... other config
};

function DarkChart({ renderData, indexes }) {
  return (
    <ChartWheel
      renderData={renderData}
      indexes={indexes}
      visualConfig={darkModeConfig}
    />
  );
}
```

### Interactive Chart with Click Handlers

```typescript
function InteractiveChart({ renderData, indexes }) {
  const [selectedItem, setSelectedItem] = useState<RingItemDTO | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<AspectPairDTO | null>(null);

  return (
    <div>
      <ChartWheel
        renderData={renderData}
        indexes={indexes}
        onItemClick={(item, ring) => {
          setSelectedItem(item);
          console.log('Selected:', item.id, 'in ring:', ring.id);
        }}
        onAspectClick={(aspect) => {
          setSelectedAspect(aspect);
          console.log('Selected aspect:', aspect.id);
        }}
      />
      
      {selectedItem && (
        <div>Selected: {selectedItem.id}</div>
      )}
      
      {selectedAspect && (
        <div>Selected aspect: {selectedAspect.id}</div>
      )}
    </div>
  );
}
```

### Server-Side Export

For server-side usage (e.g., in Next.js API routes or server components), you can import the `buildIndexes` utility from the server export:

```typescript
// server.ts or API route
import { buildIndexes } from '@gaia-tools/aphrodite-react/server';
import { RenderResponse } from '@gaia-tools/coeus-api-client';

export async function processChart(renderData: RenderResponse) {
  const indexes = buildIndexes(renderData);
  // Process chart data server-side
  return indexes;
}
```

## Package Exports

The package provides multiple entry points:

- **Main export** (`@gaia-tools/aphrodite-react`): Hooks, components, and utilities
- **Hooks** (`@gaia-tools/aphrodite-react/hooks`): `useChartRender` hook
- **Components** (`@gaia-tools/aphrodite-react/components`): `ChartWheel` component
- **Server** (`@gaia-tools/aphrodite-react/server`): Server-side utilities (no React dependencies)

## Version Compatibility

- **React**: Requires version ^18.0.0 or higher
- **Next.js**: Compatible with Next.js 13+ (App Router and Pages Router)
- **TypeScript**: Compatible with TypeScript 5.0+
- **Node.js**: Compatible with Node.js 18+ (for development and SSR)

## Development

### Building

```bash
npm run build
```

This builds the package using `tsup`, generating both CommonJS and ES module outputs with TypeScript declarations.

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- Unit tests for components: `src/components/__tests__/`
- Unit tests for utilities: `src/utils/__tests__/`
- Test fixtures: `src/test/fixtures.ts`
- Test utilities: `src/test/utils.tsx`

### Writing Tests

Tests use React Testing Library and Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartWheel } from '../ChartWheel';
import { createMockRenderResponse } from '../../test/fixtures';

describe('ChartWheel', () => {
  it('renders SVG element', () => {
    const renderData = createMockRenderResponse();
    const indexes = buildIndexes(renderData);
    render(<ChartWheel renderData={renderData} indexes={indexes} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Chart Not Rendering

**Problem**: Chart appears blank or nothing is rendered.

**Solutions**:
- Ensure `renderData` and `indexes` are both provided and not null
- Verify that `renderData` contains valid chart data structure
- Check that `indexes` was built using `buildIndexes(renderData)`
- Verify D3.js is installed and available
- Check browser console for JavaScript errors
- Ensure the component is mounted in a client component (use `'use client'` directive in Next.js)

### Hook Not Fetching Data

**Problem**: `useChartRender` hook doesn't fetch data.

**Solutions**:
- Verify `apiClient` is properly configured with the correct base URL
- Check that `instanceId` is a valid string
- Ensure `enabled` option is not set to `false`
- Check network tab for API request errors
- Verify the API endpoint is accessible and returns valid data

### Type Errors

**Problem**: TypeScript errors when using the library.

**Solutions**:
- Ensure all peer dependencies are installed
- Verify TypeScript version is 5.0 or higher
- Check that type definitions are properly imported
- Ensure `@gaia-tools/aphrodite` and `@gaia-tools/coeus-api-client` are installed

### SSR/Hydration Errors

**Problem**: Hydration mismatches in Next.js.

**Solutions**:
- Ensure D3.js operations only run on the client side
- Use `useEffect` to initialize chart rendering after mount
- Check that server and client render the same initial state
- Verify that `ChartWheel` is used in a client component (`'use client'`)

### Click Handlers Not Working

**Problem**: `onItemClick` or `onAspectClick` handlers don't fire.

**Solutions**:
- Verify handlers are properly passed as props
- Check that the chart is fully rendered before interactions
- Ensure D3 event handlers are properly attached
- Check browser console for errors

### Performance Issues

**Problem**: Chart rendering is slow or causes lag.

**Solutions**:
- Use `React.memo` to memoize the `ChartWheel` component
- Memoize `renderData` and `indexes` if they're derived from props
- Consider using `useMemo` for expensive computations
- Reduce the number of chart elements if possible
- Use `enabled: false` in `useChartRender` to prevent unnecessary fetches

## Dependencies

### Peer Dependencies

- `react` ^18.0.0 - React library
- `react-dom` ^18.0.0 - React DOM renderer
- `@gaia-tools/aphrodite` ^0.1.0 - Core chart renderer
- `d3` ^7.8.5 - D3.js for SVG manipulation

### Dependencies

- `@gaia-tools/coeus-api-client` - API client for fetching chart data

### Dev Dependencies

- `vitest` - Test runner
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - DOM matchers for tests
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for tests
- `tsup` - TypeScript bundler
- `typescript` - TypeScript compiler

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

## License

MIT

## Links

- [GitHub Repository](https://github.com/emmygrace/aphrodite-core)
- [Issue Tracker](https://github.com/emmygrace/aphrodite-core/issues)
- [@gaia-tools/aphrodite](https://www.npmjs.com/package/@gaia-tools/aphrodite) - Core renderer package
