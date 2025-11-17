/**
 * React hook for managing chart orientation presets and ViewFrame configuration.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  OrientationPreset,
  OrientationProgram,
  ViewFrame,
  LockRule,
  ChartSnapshot,
  OrientationRuntimeState,
} from '@gaia-tools/aphrodite-shared/orientation';
import {
  allPresets,
  getPresetById,
  getPresetByName,
  presetDefault,
} from '@gaia-tools/aphrodite-shared/orientation';
import { evalOrientationProgram } from '@gaia-tools/aphrodite-core/utils/viewFrame';

export interface UseOrientationOptions {
  /**
   * Initial preset ID or preset object
   */
  initialPreset?: string | OrientationPreset;
  /**
   * Orientation program (overrides preset if provided)
   */
  program?: OrientationProgram;
  /**
   * Chart snapshot for program evaluation (required if program is provided)
   */
  chart?: ChartSnapshot;
  /**
   * Custom ViewFrame (overrides preset/program if provided)
   */
  customViewFrame?: ViewFrame;
  /**
   * Custom lock rules (overrides preset/program if provided)
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
 * Convert a preset to an orientation program
 */
function resolvePreset(
  presetOrId: string | OrientationPreset | undefined
): OrientationPreset | null {
  if (!presetOrId) {
    return presetDefault;
  }
  if (typeof presetOrId === 'string') {
    return getPresetById(presetOrId) ?? presetDefault;
  }
  return presetOrId;
}

/**
 * Hook for managing chart orientation.
 * Provides easy access to presets, programs, and custom orientation configuration.
 */
export function useOrientation(
  options: UseOrientationOptions = {}
): UseOrientationResult {
  const { initialPreset, program, chart, customViewFrame, customLocks } = options;

  // Initialize state
  const getInitialPreset = useCallback((): OrientationPreset | null => {
    if (customViewFrame || program) {
      return null; // Custom frame or program takes precedence
    }
    return resolvePreset(initialPreset);
  }, [initialPreset, customViewFrame, program]);

  const [currentPreset, setCurrentPreset] = useState<OrientationPreset | null>(
    getInitialPreset
  );
  const [customFrame, setCustomFrame] = useState<ViewFrame | undefined>(
    customViewFrame
  );
  const [customLockRules, setCustomLockRules] = useState<LockRule[] | undefined>(
    customLocks
  );
  const [runtimeState, setRuntimeState] = useState<OrientationRuntimeState | undefined>();

  // Compute current ViewFrame and locks
  const { viewFrame, locks, newRuntimeState } = useMemo(() => {
    // Custom frame takes highest precedence
    if (customFrame) {
      return {
        viewFrame: customFrame,
        locks: customLockRules ?? [],
        newRuntimeState: runtimeState,
      };
    }

    // Custom locks take precedence over program/preset locks
    if (customLockRules) {
      if (program && chart) {
        const result = evalOrientationProgram(program, chart, runtimeState);
        return {
          viewFrame: result.frame,
          locks: customLockRules,
          newRuntimeState: result.state,
        };
      }
      const preset = currentPreset ?? resolvePreset(initialPreset);
      return {
        viewFrame: preset?.frame ?? presetDefault.frame,
        locks: customLockRules,
        newRuntimeState: runtimeState,
      };
    }

    // Evaluate program if provided
    if (program && chart) {
      const result = evalOrientationProgram(program, chart, runtimeState);
      return {
        viewFrame: result.frame,
        locks: result.locks,
        newRuntimeState: result.state,
      };
    }

    // Fall back to preset
    const preset = currentPreset ?? resolvePreset(initialPreset);
    return {
      viewFrame: preset?.frame ?? presetDefault.frame,
      locks: preset?.locks ?? presetDefault.locks,
      newRuntimeState: runtimeState,
    };
  }, [customFrame, customLockRules, program, chart, runtimeState, currentPreset, initialPreset]);

  // Update runtime state when it changes
  useEffect(() => {
    if (newRuntimeState !== runtimeState) {
      setRuntimeState(newRuntimeState);
    }
  }, [newRuntimeState, runtimeState]);

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

