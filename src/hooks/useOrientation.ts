/**
 * React hook for managing chart orientation presets and ViewFrame configuration.
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  OrientationPreset,
  ViewFrame,
  LockRule,
} from '@gaia-tools/aphrodite-shared/orientation';
import {
  allPresets,
  getPresetById,
  getPresetByName,
  presetDefault,
} from '@gaia-tools/aphrodite-shared/orientation';

export interface UseOrientationOptions {
  /**
   * Initial preset ID or preset object
   */
  initialPreset?: string | OrientationPreset;
  /**
   * Custom ViewFrame (overrides preset if provided)
   */
  customViewFrame?: ViewFrame;
  /**
   * Custom lock rules (overrides preset if provided)
   */
  customLocks?: LockRule[];
}

export interface UseOrientationResult {
  /**
   * Current ViewFrame
   */
  viewFrame: ViewFrame;
  /**
   * Current lock rules
   */
  locks: LockRule[];
  /**
   * Current preset (if using a preset)
   */
  currentPreset: OrientationPreset | null;
  /**
   * All available presets
   */
  allPresets: OrientationPreset[];
  /**
   * Set orientation using a preset ID
   */
  setPreset: (presetId: string) => void;
  /**
   * Set orientation using a preset object
   */
  setPresetObject: (preset: OrientationPreset) => void;
  /**
   * Set custom ViewFrame
   */
  setViewFrame: (frame: ViewFrame) => void;
  /**
   * Set custom lock rules
   */
  setLocks: (locks: LockRule[]) => void;
  /**
   * Reset to default preset
   */
  reset: () => void;
}

/**
 * Hook for managing chart orientation.
 * Provides easy access to presets and custom orientation configuration.
 */
export function useOrientation(
  options: UseOrientationOptions = {}
): UseOrientationResult {
  const { initialPreset, customViewFrame, customLocks } = options;

  // Initialize state
  const getInitialPreset = useCallback((): OrientationPreset | null => {
    if (customViewFrame) {
      return null; // Custom frame takes precedence
    }
    if (initialPreset) {
      if (typeof initialPreset === 'string') {
        return getPresetById(initialPreset) ?? presetDefault;
      }
      return initialPreset;
    }
    return presetDefault;
  }, [initialPreset, customViewFrame]);

  const [currentPreset, setCurrentPreset] = useState<OrientationPreset | null>(
    getInitialPreset
  );
  const [customFrame, setCustomFrame] = useState<ViewFrame | undefined>(
    customViewFrame
  );
  const [customLockRules, setCustomLockRules] = useState<LockRule[] | undefined>(
    customLocks
  );

  // Compute current ViewFrame and locks
  const viewFrame = useMemo(() => {
    if (customFrame) {
      return customFrame;
    }
    return currentPreset?.frame ?? presetDefault.frame;
  }, [customFrame, currentPreset]);

  const locks = useMemo(() => {
    if (customLockRules) {
      return customLockRules;
    }
    return currentPreset?.locks ?? presetDefault.locks;
  }, [customLockRules, currentPreset]);

  // Actions
  const setPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (preset) {
      setCurrentPreset(preset);
      setCustomFrame(undefined);
      setCustomLockRules(undefined);
    }
  }, []);

  const setPresetObject = useCallback((preset: OrientationPreset) => {
    setCurrentPreset(preset);
    setCustomFrame(undefined);
    setCustomLockRules(undefined);
  }, []);

  const setViewFrame = useCallback((frame: ViewFrame) => {
    setCustomFrame(frame);
    setCurrentPreset(null);
  }, []);

  const setLocks = useCallback((newLocks: LockRule[]) => {
    setCustomLockRules(newLocks);
  }, []);

  const reset = useCallback(() => {
    setCurrentPreset(presetDefault);
    setCustomFrame(undefined);
    setCustomLockRules(undefined);
  }, []);

  return {
    viewFrame,
    locks,
    currentPreset,
    allPresets,
    setPreset,
    setPresetObject,
    setViewFrame,
    setLocks,
    reset,
  };
}

