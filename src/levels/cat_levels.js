// Tilemaps & Level Configurations for Super Mario Cat Co-Op Arcade
export const TILE = {
  EMPTY: 0,
  GROUND: 1,      // Solid ground tile
  BRICK: 2,       // Breakable brick (Big Cat can smash)
  BLOCK_ITEM: 3,  // Surprise block containing Mouse
  YARN_BALL: 4,   // Bouncy platform
  LILY_PAD: 5,    // Floating platform
  WATER: 6,       // Hazard water
  GOAL_POST: 7,   // Golden Collar level end post
};

export const CAT_LEVELS = [
  {
    id: 1,
    name: 'Yarn Kingdom',
    theme: 'yarn',
    bgColor: '#1b1428',
    skyColor: '#2d2244',
    groundColor: '#7a3e9d',
    platformColor: '#d65db1',
    width: 120, // grid tiles wide
    height: 18, // grid tiles high
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 112,
    mice: [
      { tileX: 18, tileY: 11 },
      { tileX: 42, tileY: 9 },
      { tileX: 75, tileY: 10 },
      { tileX: 95, tileY: 11 },
    ],
    dogs: [
      { type: 'chihuahua', tileX: 25, tileY: 14, range: 4, speed: 1.8 },
      { type: 'corgi', tileX: 55, tileY: 14, range: 6, speed: 1.2 },
      { type: 'bulldog', tileX: 85, tileY: 14, range: 5, speed: 1.0 },
    ],
    platforms: [
      // Floor
      { x: 0, y: 15, w: 120, h: 3, type: TILE.GROUND },
      // Platforms & Bouncy Yarn Balls
      { x: 14, y: 12, w: 5, h: 1, type: TILE.YARN_BALL },
      { x: 28, y: 10, w: 6, h: 1, type: TILE.GROUND },
      { x: 40, y: 10, w: 4, h: 1, type: TILE.BRICK },
      { x: 44, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM },
      { x: 45, y: 10, w: 4, h: 1, type: TILE.BRICK },
      { x: 60, y: 11, w: 5, h: 1, type: TILE.YARN_BALL },
      { x: 72, y: 11, w: 7, h: 1, type: TILE.GROUND },
      { x: 90, y: 12, w: 6, h: 1, type: TILE.YARN_BALL },
    ]
  },

  {
    id: 2,
    name: 'Catnip Forest',
    theme: 'catnip',
    bgColor: '#0f241a',
    skyColor: '#1a3a2a',
    groundColor: '#2b6343',
    platformColor: '#4ee48d',
    width: 130,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 122,
    mice: [
      { tileX: 22, tileY: 10 },
      { tileX: 52, tileY: 8 },
      { tileX: 82, tileY: 9 },
      { tileX: 105, tileY: 11 },
    ],
    dogs: [
      { type: 'corgi', tileX: 30, tileY: 14, range: 6, speed: 1.4 },
      { type: 'chihuahua', tileX: 65, tileY: 14, range: 5, speed: 2.0 },
      { type: 'bulldog', tileX: 95, tileY: 14, range: 6, speed: 1.2 },
    ],
    platforms: [
      { x: 0, y: 15, w: 130, h: 3, type: TILE.GROUND },
      // Giant Mushroom Platforms
      { x: 18, y: 11, w: 6, h: 1, type: TILE.GROUND },
      { x: 35, y: 9, w: 5, h: 1, type: TILE.GROUND },
      { x: 50, y: 9, w: 5, h: 1, type: TILE.BRICK },
      { x: 68, y: 10, w: 7, h: 1, type: TILE.GROUND },
      { x: 80, y: 10, w: 4, h: 1, type: TILE.BLOCK_ITEM },
      { x: 100, y: 12, w: 6, h: 1, type: TILE.GROUND },
    ]
  },

  {
    id: 3,
    name: 'Fish Pond Alley',
    theme: 'fish',
    bgColor: '#0a1d36',
    skyColor: '#12325c',
    groundColor: '#1c528e',
    platformColor: '#00d2ff',
    width: 140,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 132,
    mice: [
      { tileX: 25, tileY: 10 },
      { tileX: 60, tileY: 8 },
      { tileX: 90, tileY: 9 },
      { tileX: 115, tileY: 10 },
    ],
    dogs: [
      { type: 'bulldog', tileX: 35, tileY: 14, range: 5, speed: 1.2 },
      { type: 'chihuahua', tileX: 75, tileY: 14, range: 7, speed: 2.2 },
      { type: 'bulldog', tileX: 108, tileY: 14, range: 6, speed: 1.4 },
    ],
    platforms: [
      { x: 0, y: 15, w: 140, h: 3, type: TILE.GROUND },
      // Lily Pads over Pond
      { x: 22, y: 11, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 38, y: 10, w: 6, h: 1, type: TILE.GROUND },
      { x: 55, y: 9, w: 6, h: 1, type: TILE.LILY_PAD },
      { x: 72, y: 10, w: 5, h: 1, type: TILE.BRICK },
      { x: 88, y: 10, w: 5, h: 1, type: TILE.LILY_PAD },
      { x: 110, y: 11, w: 6, h: 1, type: TILE.GROUND },
    ]
  },

  {
    id: 4,
    name: 'Dog Citadel',
    theme: 'citadel',
    bgColor: '#2a0e14',
    skyColor: '#4a1824',
    groundColor: '#7a2234',
    platformColor: '#ff4466',
    width: 150,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 142,
    mice: [
      { tileX: 30, tileY: 9 },
      { tileX: 70, tileY: 8 },
      { tileX: 105, tileY: 9 },
      { tileX: 130, tileY: 10 },
    ],
    dogs: [
      { type: 'chihuahua', tileX: 25, tileY: 14, range: 6, speed: 2.4 },
      { type: 'bulldog', tileX: 50, tileY: 14, range: 7, speed: 1.5 },
      { type: 'corgi', tileX: 85, tileY: 14, range: 6, speed: 1.8 },
      { type: 'bulldog', tileX: 120, tileY: 14, range: 8, speed: 1.6 },
    ],
    platforms: [
      { x: 0, y: 15, w: 150, h: 3, type: TILE.GROUND },
      { x: 20, y: 11, w: 6, h: 1, type: TILE.BRICK },
      { x: 45, y: 10, w: 7, h: 1, type: TILE.GROUND },
      { x: 65, y: 9, w: 5, h: 1, type: TILE.BLOCK_ITEM },
      { x: 80, y: 10, w: 8, h: 1, type: TILE.BRICK },
      { x: 100, y: 10, w: 6, h: 1, type: TILE.GROUND },
      { x: 125, y: 11, w: 7, h: 1, type: TILE.GROUND },
    ]
  }
];
