import { describe, it, expect } from 'vitest';
import { buildIndexes } from '../buildIndexes';
import { createMockRenderResponse, createMinimalRenderResponse } from '../../test/fixtures';
import type { RenderResponse } from '@gaia-tools/coeus-api-client';

describe('buildIndexes', () => {
  it('builds planet indexes from render data', () => {
    const renderData = createMockRenderResponse();
    const indexes = buildIndexes(renderData);

    expect(indexes.ringById).toBeDefined();
    expect(indexes.ringById['planets']).toBeDefined();
    expect(indexes.itemByRingAndId['planets']).toBeDefined();
    expect(indexes.itemByRingAndId['planets']['planet-sun']).toBeDefined();
    expect(indexes.itemByRingAndId['planets']['planet-moon']).toBeDefined();
  });

  it('builds sign indexes from render data', () => {
    const renderData = createMockRenderResponse();
    const indexes = buildIndexes(renderData);

    expect(indexes.ringById['signs']).toBeDefined();
    expect(indexes.itemByRingAndId['signs']).toBeDefined();
    expect(indexes.itemByRingAndId['signs']['sign-aries']).toBeDefined();
  });

  it('builds house indexes from render data', () => {
    const renderData = createMockRenderResponse();
    const indexes = buildIndexes(renderData);

    expect(indexes.ringById['houses']).toBeDefined();
    expect(indexes.itemByRingAndId['houses']).toBeDefined();
    expect(indexes.itemByRingAndId['houses']['house-1']).toBeDefined();
  });

  it('handles empty render data', () => {
    const renderData = createMinimalRenderResponse();
    const indexes = buildIndexes(renderData);

    expect(indexes.ringById).toEqual({});
    expect(indexes.itemByRingAndId).toEqual({});
    expect(indexes.aspectSetById).toEqual({});
    expect(indexes.aspectById).toEqual({});
    expect(indexes.itemsByLogicalId).toEqual({});
    expect(indexes.aspectsByObjectLogicalId).toEqual({});
  });

  it('handles missing ring items', () => {
    const renderData = createMockRenderResponse({
      wheel: {
        id: 'wheel-1',
        name: 'Test Wheel',
        radius: { inner: 0, outer: 100 },
        rings: [
          {
            id: 'empty-ring',
            type: 'planets',
            label: 'Empty Planets',
            order: 0,
            radius: { inner: 0, outer: 100 },
            items: undefined,
          },
        ],
      },
    });

    const indexes = buildIndexes(renderData);

    expect(indexes.ringById['empty-ring']).toBeDefined();
    expect(indexes.itemByRingAndId['empty-ring']).toBeUndefined();
  });

  it('handles rings with empty items array', () => {
    const renderData = createMockRenderResponse({
      wheel: {
        id: 'wheel-1',
        name: 'Test Wheel',
        radius: { inner: 0, outer: 100 },
        rings: [
          {
            id: 'empty-ring',
            type: 'planets',
            label: 'Empty Planets',
            order: 0,
            radius: { inner: 0, outer: 100 },
            items: [],
          },
        ],
      },
    });

    const indexes = buildIndexes(renderData);

    expect(indexes.ringById['empty-ring']).toBeDefined();
    expect(indexes.itemByRingAndId['empty-ring']).toEqual({});
  });

  it('builds aspect indexes when aspects are present', () => {
    const renderData = createMockRenderResponse({
      aspects: {
        sets: {
          'natal-aspects': {
            id: 'natal-aspects',
            label: 'Natal Aspects',
            kind: 'intra_layer',
            layerIds: ['natal'],
            pairs: [
              {
                id: 'aspect-1',
                from: {
                  layerId: 'natal',
                  objectType: 'planet',
                  objectId: 'sun',
                },
                to: {
                  layerId: 'natal',
                  objectType: 'planet',
                  objectId: 'moon',
                },
                aspect: {
                  type: 'trine',
                  exactAngle: 120.0,
                  orb: 0.25,
                  isApplying: false,
                  isExact: false,
                },
              },
            ],
          },
        },
      },
    });

    const indexes = buildIndexes(renderData);

    expect(indexes.aspectSetById['natal-aspects']).toBeDefined();
    expect(indexes.aspectById['aspect-1']).toBeDefined();
    expect(indexes.aspectsByObjectLogicalId['natal:planet:sun']).toContain('aspect-1');
    expect(indexes.aspectsByObjectLogicalId['natal:planet:moon']).toContain('aspect-1');
  });

  it('builds itemsByLogicalId index for planets', () => {
    const renderData = createMockRenderResponse();
    const indexes = buildIndexes(renderData);

    // Check that planet logical IDs are created
    const sunLogicalId = 'natal:planet:sun';
    expect(indexes.itemsByLogicalId[sunLogicalId]).toBeDefined();
    expect(indexes.itemsByLogicalId[sunLogicalId].length).toBeGreaterThan(0);
  });

  it('handles malformed data gracefully', () => {
    const renderData: any = {
      chartInstance: {
        id: 'instance-1',
        chartDefinitionId: 'chart-1',
        title: 'Test',
        ownerUserId: 'user-1',
        subjects: [],
        effectiveDateTimes: {},
      },
      settings: {
        zodiacType: 'tropical',
        houseSystem: 'placidus',
        orbSettings: {},
        includeObjects: [],
      },
      coordinateSystem: {
        angleUnit: 'degrees',
        angleRange: [0, 360],
        direction: 'cw',
        zeroPoint: {
          type: 'zodiac',
          signStart: 'aries',
          offsetDegrees: 0,
        },
      },
      layers: {},
      aspects: {
        sets: {},
      },
      wheel: {
        id: 'wheel-1',
        name: 'Test Wheel',
        radius: { inner: 0, outer: 100 },
        rings: null, // Malformed: rings should be an array
      },
    };

    // Should throw an error for malformed data (rings is null, not an array)
    // This is expected behavior - the function requires valid data structure
    expect(() => buildIndexes(renderData as RenderResponse)).toThrow();
  });
});

