import type {
  RenderResponse,
  IndexesDTO,
  ChartInstanceSummary,
  ChartSettings,
  CoordinateSystemDTO,
  LayerDTO,
  AspectsDTO,
  WheelDTO,
  RingDTO,
  PlanetRingItem,
  HouseRingItem,
  SignRingItem,
  AspectRingItem,
} from '@gaia-tools/coeus-api-client';

/**
 * Creates a basic mock RenderResponse for testing
 */
export function createMockRenderResponse(overrides?: Partial<RenderResponse>): RenderResponse {
  const defaultResponse: RenderResponse = {
    chartInstance: {
      id: 'instance-1',
      chartDefinitionId: 'chart-1',
      title: 'Test Chart',
      description: 'Test Description',
      ownerUserId: 'user-1',
      subjects: [
        {
          id: 'subject-1',
          label: 'Test Person',
          birthDateTime: '1990-01-01T12:00:00Z',
          birthTimezone: 'UTC',
          location: {
            name: 'New York',
            lat: 40.7128,
            lon: -74.0060,
          },
        },
      ],
      effectiveDateTimes: {
        natal: '1990-01-01T12:00:00Z',
      },
    },
    settings: {
      zodiacType: 'tropical',
      houseSystem: 'placidus',
      orbSettings: {
        conjunction: 8,
        opposition: 8,
        trine: 7,
        square: 6,
        sextile: 4,
      },
      includeObjects: ['sun', 'moon', 'mercury', 'venus', 'mars'],
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
    layers: {
      natal: {
        id: 'natal',
        label: 'Natal',
        kind: 'natal',
        subjectId: 'subject-1',
        dateTime: '1990-01-01T12:00:00Z',
        location: {
          name: 'New York',
          lat: 40.7128,
          lon: -74.0060,
        },
        positions: {
          planets: {
            sun: { lon: 280.5, lat: 1.2, speedLon: 0.95, retrograde: false },
            moon: { lon: 40.25, lat: -2.3, speedLon: 12.3, retrograde: false },
            mercury: { lon: 275.0, lat: 0.5, speedLon: 1.2, retrograde: false },
            venus: { lon: 285.0, lat: 1.5, speedLon: 0.8, retrograde: false },
            mars: { lon: 120.0, lat: 2.0, speedLon: 0.5, retrograde: false },
          },
          houses: {
            system: 'placidus',
            cusps: {
              '1': 15.0,
              '2': 45.0,
              '3': 75.0,
              '4': 105.0,
              '5': 135.0,
              '6': 165.0,
              '7': 195.0,
              '8': 225.0,
              '9': 255.0,
              '10': 285.0,
              '11': 315.0,
              '12': 345.0,
            },
            angles: {
              asc: 15.0,
              mc: 285.0,
              ic: 105.0,
              dc: 195.0,
            },
          },
        },
      },
    },
    aspects: {
      sets: {},
    },
    wheel: {
      id: 'wheel-1',
      name: 'Test Wheel',
      description: 'Test Wheel Description',
      radius: {
        inner: 0,
        outer: 100,
      },
      rings: [
        {
          id: 'signs',
          type: 'signs',
          label: 'Signs',
          order: 0,
          radius: { inner: 0, outer: 30 },
          dataSource: { kind: 'static_zodiac' },
          items: [
            {
              id: 'sign-aries',
              kind: 'sign',
              index: 0,
              label: 'Aries',
              glyph: '♈',
              startLon: 0,
              endLon: 30,
            },
            {
              id: 'sign-taurus',
              kind: 'sign',
              index: 1,
              label: 'Taurus',
              glyph: '♉',
              startLon: 30,
              endLon: 60,
            },
          ] as SignRingItem[],
        },
        {
          id: 'houses',
          type: 'houses',
          label: 'Houses',
          order: 1,
          radius: { inner: 30, outer: 60 },
          dataSource: { kind: 'layer_houses', layerId: 'natal' },
          items: [
            {
              id: 'house-1',
              kind: 'houseCusp',
              houseIndex: 1,
              lon: 15.0,
            },
            {
              id: 'house-2',
              kind: 'houseCusp',
              houseIndex: 2,
              lon: 45.0,
            },
          ] as HouseRingItem[],
        },
        {
          id: 'planets',
          type: 'planets',
          label: 'Planets',
          order: 2,
          radius: { inner: 60, outer: 100 },
          dataSource: { kind: 'layer_planets', layerId: 'natal' },
          items: [
            {
              id: 'planet-sun',
              kind: 'planet',
              planetId: 'sun',
              layerId: 'natal',
              lon: 280.5,
              lat: 1.2,
              speedLon: 0.95,
              retrograde: false,
              signIndex: 9,
              signDegree: 10.5,
              houseIndex: 10,
            },
            {
              id: 'planet-moon',
              kind: 'planet',
              planetId: 'moon',
              layerId: 'natal',
              lon: 40.25,
              lat: -2.3,
              speedLon: 12.3,
              retrograde: false,
              signIndex: 1,
              signDegree: 10.25,
              houseIndex: 1,
            },
          ] as PlanetRingItem[],
        },
      ],
    },
  };

  return {
    ...defaultResponse,
    ...overrides,
    chartInstance: {
      ...defaultResponse.chartInstance,
      ...overrides?.chartInstance,
    },
    settings: {
      ...defaultResponse.settings,
      ...overrides?.settings,
    },
    wheel: {
      ...defaultResponse.wheel,
      ...overrides?.wheel,
      rings: overrides?.wheel?.rings ?? defaultResponse.wheel.rings,
    },
  };
}

/**
 * Creates a minimal RenderResponse with empty rings
 */
export function createMinimalRenderResponse(): RenderResponse {
  return {
    chartInstance: {
      id: 'instance-minimal',
      chartDefinitionId: 'chart-1',
      title: 'Minimal Chart',
      ownerUserId: 'user-1',
      subjects: [],
      effectiveDateTimes: {},
    },
    settings: {
      zodiacType: 'tropical',
      houseSystem: 'placidus',
      orbSettings: {
        conjunction: 8,
        opposition: 8,
        trine: 7,
        square: 6,
        sextile: 4,
      },
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
      id: 'wheel-minimal',
      name: 'Minimal Wheel',
      radius: {
        inner: 0,
        outer: 100,
      },
      rings: [],
    },
  };
}

/**
 * Creates a RenderResponse with aspects
 */
export function createRenderResponseWithAspects(): RenderResponse {
  const base = createMockRenderResponse();
  return {
    ...base,
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
  };
}

/**
 * Creates a mock IndexesDTO for testing
 */
export function createMockIndexes(overrides?: Partial<IndexesDTO>): IndexesDTO {
  const defaultIndexes: IndexesDTO = {
    ringById: {},
    itemByRingAndId: {},
    aspectSetById: {},
    aspectById: {},
    itemsByLogicalId: {},
    aspectsByObjectLogicalId: {},
  };

  return {
    ...defaultIndexes,
    ...overrides,
  };
}

