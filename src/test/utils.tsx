import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function that wraps components with any providers
 * This can be extended to include React Query, Context providers, etc.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

/**
 * Helper to wait for async operations in tests
 */
export function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

