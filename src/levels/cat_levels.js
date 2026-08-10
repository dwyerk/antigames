// Tilemaps & Level Configurations for Super Mario Cat Co-Op Arcade
export const TILE = {
  EMPTY: 0,
  GROUND: 1,      // Solid ground tile
  BRICK: 2,       // Breakable brick (Big Cat can smash)
  BLOCK_ITEM: 3,  // Surprise '?' block containing Mouse powerup
  BLOCK_USED: 4,  // Used '?' block (empty metal)
  YARN_BALL: 5,   // Bouncy yarn platform
  LILY_PAD: 6,    // Floating water platform
  WATER: 7,       // Hazard water
  GOAL_POST: 8,   // Golden Collar level end post
};

export const CAT_LEVELS = [
  {
    id: 1,
    name: '1-1: Yarn Kingdom',
    theme: 'yarn',
    bgColor: '#1b1428',
    skyColor: '#2d2244',
    groundColor: '#7a3e9d',
    platformColor: '#d65db1',
    width: 250, // 250 tiles wide extended level!
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 240,
    mice: [
      { tileX: 18, tileY: 12 },
      { tileX: 45, tileY: 10 },
      { tileX: 85, tileY: 10 },
      { tileX: 135, tileY: 11 },
      { tileX: 180, tileY: 10 },
      { tileX: 215, tileY: 11 },
    ],
    dogs: [
      { type: 'chihuahua', tileX: 25, tileY: 14, range: 6, speed: 1.8 },
      { type: 'corgi', tileX: 55, tileY: 14, range: 7, speed: 1.4 },
      { type: 'bulldog', tileX: 95, tileY: 14, range: 6, speed: 1.2 },
      { type: 'chihuahua', tileX: 145, tileY: 14, range: 8, speed: 2.0 },
      { type: 'bulldog', tileX: 190, tileY: 14, range: 7, speed: 1.5 },
    ],
    platforms: [
      // Ground floor (y = 15)
      { x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND },

      // Section 1: Low reachable stepping platforms & '?' blocks
      { x: 12, y: 12, w: 3, h: 1, type: TILE.GROUND },
      { x: 15, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 16, y: 11, w: 3, h: 1, type: TILE.BRICK },
      { x: 26, y: 12, w: 4, h: 1, type: TILE.YARN_BALL },

      // Section 2: Low-gap steps
      { x: 38, y: 12, w: 4, h: 1, type: TILE.GROUND },
      { x: 44, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 45, y: 10, w: 3, h: 1, type: TILE.BRICK },
      { x: 48, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },

      // Section 3: Bouncy Yarn & Mid Platforms
      { x: 60, y: 12, w: 5, h: 1, type: TILE.YARN_BALL },
      { x: 72, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 80, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 81, y: 11, w: 4, h: 1, type: TILE.BRICK },

      // Section 4: Extended Middle Run
      { x: 105, y: 12, w: 5, h: 1, type: TILE.GROUND },
      { x: 118, y: 11, w: 4, h: 1, type: TILE.YARN_BALL },
      { x: 130, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 131, y: 11, w: 4, h: 1, type: TILE.BRICK },
      { x: 148, y: 12, w: 6, h: 1, type: TILE.GROUND },

      // Section 5: Finale Stretch
      { x: 170, y: 11, w: 5, h: 1, type: TILE.YARN_BALL },
      { x: 185, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 186, y: 11, w: 5, h: 1, type: TILE.BRICK },
      { x: 205, y: 12, w: 6, h: 1, type: TILE.GROUND },
      { x: 220, y: 12, w: 5, h: 1, type: TILE.YARN_BALL },
    ]
  },

  {
    id: 2,
    name: '1-2: Catnip Forest',
    theme: 'catnip',
    bgColor: '#0f241a',
    skyColor: '#1a3a2a',
    groundColor: '#2b6343',
    platformColor: '#4ee48d',
    width: 250,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 240,
    mice: [
      { tileX: 20, tileY: 11 },
      { tileX: 50, tileY: 10 },
      { tileX: 95, tileY: 11 },
      { tileX: 140, tileY: 10 },
      { tileX: 195, tileY: 11 },
    ],
    dogs: [
      { type: 'corgi', tileX: 30, tileY: 14, range: 7, speed: 1.5 },
      { type: 'chihuahua', tileX: 70, tileY: 14, range: 6, speed: 2.2 },
      { type: 'bulldog', tileX: 110, tileY: 14, range: 8, speed: 1.3 },
      { type: 'corgi', tileX: 160, tileY: 14, range: 7, speed: 1.6 },
      { type: 'bulldog', tileX: 210, tileY: 14, range: 8, speed: 1.4 },
    ],
    platforms: [
      { x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND },
      // Low mushroom steps
      { x: 15, y: 12, w: 5, h: 1, type: TILE.GROUND },
      { x: 24, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 35, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 48, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 49, y: 10, w: 4, h: 1, type: TILE.BRICK },
      { x: 65, y: 12, w: 6, h: 1, type: TILE.GROUND },
      { x: 80, y: 11, w: 5, h: 1, type: TILE.GROUND },
      { x: 92, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 115, y: 12, w: 6, h: 1, type: TILE.GROUND },
      { x: 135, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 136, y: 11, w: 5, h: 1, type: TILE.BRICK },
      { x: 158, y: 12, w: 6, h: 1, type: TILE.GROUND },
      { x: 180, y: 11, w: 5, h: 1, type: TILE.GROUND },
      { x: 194, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 215, y: 12, w: 6, h: 1, type: TILE.GROUND },
    ]
  },

  {
    id: 3,
    name: '1-3: Fish Pond Alley',
    theme: 'fish',
    bgColor: '#0a1d36',
    skyColor: '#12325c',
    groundColor: '#1c528e',
    platformColor: '#00d2ff',
    width: 250,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 240,
    mice: [
      { tileX: 25, tileY: 10 },
      { tileX: 65, tileY: 10 },
      { tileX: 110, tileY: 11 },
      { tileX: 160, tileY: 10 },
      { tileX: 205, tileY: 11 },
    ],
    dogs: [
      { type: 'bulldog', tileX: 35, tileY: 14, range: 6, speed: 1.3 },
      { type: 'chihuahua', tileX: 80, tileY: 14, range: 8, speed: 2.3 },
      { type: 'bulldog', tileX: 130, tileY: 14, range: 7, speed: 1.4 },
      { type: 'corgi', tileX: 175, tileY: 14, range: 7, speed: 1.6 },
      { type: 'bulldog', tileX: 215, tileY: 14, range: 8, speed: 1.5 },
    ],
    platforms: [
      { x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND },
      { x: 18, y: 12, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 28, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 40, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 55, y: 12, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 64, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 75, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 95, y: 12, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 108, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 125, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 145, y: 12, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 158, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 175, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 198, y: 12, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 218, y: 12, w: 6, h: 1, type: TILE.GROUND },
    ]
  },

  {
    id: 4,
    name: '1-4: Dog Citadel',
    theme: 'citadel',
    bgColor: '#2a0e14',
    skyColor: '#4a1824',
    groundColor: '#7a2234',
    platformColor: '#ff4466',
    width: 250,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 240,
    mice: [
      { tileX: 30, tileY: 10 },
      { tileX: 75, tileY: 10 },
      { tileX: 120, tileY: 11 },
      { tileX: 170, tileY: 10 },
      { tileX: 210, tileY: 11 },
    ],
    dogs: [
      { type: 'chihuahua', tileX: 25, tileY: 14, range: 7, speed: 2.5 },
      { type: 'bulldog', tileX: 55, tileY: 14, range: 8, speed: 1.6 },
      { type: 'corgi', tileX: 95, tileY: 14, range: 7, speed: 1.8 },
      { type: 'bulldog', tileX: 140, tileY: 14, range: 8, speed: 1.7 },
      { type: 'bulldog', tileX: 190, tileY: 14, range: 9, speed: 1.8 },
    ],
    platforms: [
      { x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND },
      { x: 20, y: 12, w: 6, h: 1, type: TILE.BRICK },
      { x: 28, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 42, y: 11, w: 7, h: 1, type: TILE.GROUND },
      { x: 60, y: 12, w: 5, h: 1, type: TILE.BRICK },
      { x: 72, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 88, y: 11, w: 7, h: 1, type: TILE.GROUND },
      { x: 108, y: 12, w: 6, h: 1, type: TILE.BRICK },
      { x: 118, y: 11, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 135, y: 11, w: 7, h: 1, type: TILE.GROUND },
      { x: 155, y: 12, w: 6, h: 1, type: TILE.BRICK },
      { x: 168, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 188, y: 11, w: 7, h: 1, type: TILE.GROUND },
      { x: 208, y: 12, w: 6, h: 1, type: TILE.GROUND },
    ]
  }
];
