import { useState, useEffect, useMemo } from 'react';
import { ApiClient, RenderResponse, IndexesDTO } from '@gaia-tools/coeus-api-client';
import { buildIndexes } from '../utils/buildIndexes';

export type UseChartRenderOptions = {
  instanceId: string;
  wheelIdOverride?: string; // optional query param to render with a different wheel
  enabled?: boolean; // For conditional fetching
};

export type UseChartRenderResult = {
  data: RenderResponse | null;
  indexes: IndexesDTO | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

/**
 * Hook that fetches /render endpoint and builds indexes.
 * This is the main data fetching hook for chart rendering.
 */
export function useChartRender(
  apiClient: ApiClient,
  options: UseChartRenderOptions
): UseChartRenderResult {
  const { instanceId, wheelIdOverride, enabled = true } = options;
  const [data, setData] = useState<RenderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const renderData = await apiClient.instances.render(instanceId, wheelIdOverride);
        if (!cancelled) {
          setData(renderData);
        }
      } catch (err: any) {
        if (!cancelled) {
          setIsError(true);
          // Include more error details for debugging
          const errorMessage = err.response?.data?.detail || err.message || String(err);
          console.error('Chart render error:', {
            instanceId,
            error: errorMessage,
            response: err.response?.data,
            status: err.response?.status,
          });
          setError(err);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [apiClient, instanceId, wheelIdOverride, enabled]);

  // Derive indexes from data (purely derived, no separate network call)
  const indexes = useMemo(() => {
    if (!data) return null;
    return buildIndexes(data);
  }, [data]);

  const refetch = () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    apiClient.instances
      .render(instanceId, wheelIdOverride)
      .then((renderData) => {
        setData(renderData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsError(true);
        setError(err);
        setData(null);
        setIsLoading(false);
      });
  };

  return {
    data: data || null,
    indexes,
    isLoading,
    isError,
    error,
    refetch,
  };
}

