// 4 Worlds x 10 Levels Each (40 Levels Total) for Super Mario Cat Co-Op Arcade
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

export const WORLDS = [
  {
    id: 1,
    name: 'World 1: Yarn Kingdom',
    theme: 'yarn',
    bgColor: '#1b1428',
    skyColor: '#2d2244',
    groundColor: '#7a3e9d',
    platformColor: '#d65db1',
    accentColor: '#ff00aa',
    nodes: [
      { id: '1-1', type: 'level', levelNum: 1, gridX: 1, gridY: 2, name: 'Level 1-1' },
      { id: '1-2', type: 'level', levelNum: 2, gridX: 2, gridY: 2, name: 'Level 1-2' },
      { id: '1-3', type: 'level', levelNum: 3, gridX: 3, gridY: 2, name: 'Level 1-3' },
      { id: 'bonus-1', type: 'bonus', levelNum: 0, gridX: 3, gridY: 1, name: 'Catnip House' },
      { id: '1-4', type: 'level', levelNum: 4, gridX: 4, gridY: 2, name: 'Level 1-4' },
      { id: '1-5', type: 'level', levelNum: 5, gridX: 5, gridY: 2, name: 'Level 1-5' },
      { id: '1-6', type: 'level', levelNum: 6, gridX: 5, gridY: 3, name: 'Level 1-6' },
      { id: '1-7', type: 'level', levelNum: 7, gridX: 6, gridY: 3, name: 'Level 1-7' },
      { id: '1-8', type: 'level', levelNum: 8, gridX: 7, gridY: 3, name: 'Level 1-8' },
      { id: '1-9', type: 'level', levelNum: 9, gridX: 7, gridY: 2, name: 'Level 1-9' },
      { id: '1-10', type: 'fortress', levelNum: 10, gridX: 8, gridY: 2, name: 'Level 1-10 Fortress' },
    ]
  },
  {
    id: 2,
    name: 'World 2: Catnip Forest',
    theme: 'catnip',
    bgColor: '#0f241a',
    skyColor: '#1a3a2a',
    groundColor: '#2b6343',
    platformColor: '#4ee48d',
    accentColor: '#00ff66',
    nodes: [
      { id: '2-1', type: 'level', levelNum: 1, gridX: 1, gridY: 2, name: 'Level 2-1' },
      { id: '2-2', type: 'level', levelNum: 2, gridX: 2, gridY: 2, name: 'Level 2-2' },
      { id: '2-3', type: 'level', levelNum: 3, gridX: 3, gridY: 2, name: 'Level 2-3' },
      { id: '2-4', type: 'level', levelNum: 4, gridX: 4, gridY: 2, name: 'Level 2-4' },
      { id: '2-5', type: 'level', levelNum: 5, gridX: 4, gridY: 3, name: 'Level 2-5' },
      { id: '2-6', type: 'level', levelNum: 6, gridX: 5, gridY: 3, name: 'Level 2-6' },
      { id: '2-7', type: 'level', levelNum: 7, gridX: 6, gridY: 3, name: 'Level 2-7' },
      { id: '2-8', type: 'level', levelNum: 8, gridX: 6, gridY: 2, name: 'Level 2-8' },
      { id: '2-9', type: 'level', levelNum: 9, gridX: 7, gridY: 2, name: 'Level 2-9' },
      { id: '2-10', type: 'fortress', levelNum: 10, gridX: 8, gridY: 2, name: 'Level 2-10 Fortress' },
    ]
  },
  {
    id: 3,
    name: 'World 3: Fish Pond Alley',
    theme: 'fish',
    bgColor: '#0a1d36',
    skyColor: '#12325c',
    groundColor: '#1c528e',
    platformColor: '#00d2ff',
    accentColor: '#00bfff',
    nodes: [
      { id: '3-1', type: 'level', levelNum: 1, gridX: 1, gridY: 2, name: 'Level 3-1' },
      { id: '3-2', type: 'level', levelNum: 2, gridX: 2, gridY: 2, name: 'Level 3-2' },
      { id: '3-3', type: 'level', levelNum: 3, gridX: 3, gridY: 2, name: 'Level 3-3' },
      { id: '3-4', type: 'level', levelNum: 4, gridX: 4, gridY: 2, name: 'Level 3-4' },
      { id: '3-5', type: 'level', levelNum: 5, gridX: 5, gridY: 2, name: 'Level 3-5' },
      { id: '3-6', type: 'level', levelNum: 6, gridX: 5, gridY: 1, name: 'Level 3-6' },
      { id: '3-7', type: 'level', levelNum: 7, gridX: 6, gridY: 1, name: 'Level 3-7' },
      { id: '3-8', type: 'level', levelNum: 8, gridX: 6, gridY: 2, name: 'Level 3-8' },
      { id: '3-9', type: 'level', levelNum: 9, gridX: 7, gridY: 2, name: 'Level 3-9' },
      { id: '3-10', type: 'fortress', levelNum: 10, gridX: 8, gridY: 2, name: 'Level 3-10 Fortress' },
    ]
  },
  {
    id: 4,
    name: 'World 4: Dog Citadel',
    theme: 'citadel',
    bgColor: '#2a0e14',
    skyColor: '#4a1824',
    groundColor: '#7a2234',
    platformColor: '#ff4466',
    accentColor: '#ff0033',
    nodes: [
      { id: '4-1', type: 'level', levelNum: 1, gridX: 1, gridY: 2, name: 'Level 4-1' },
      { id: '4-2', type: 'level', levelNum: 2, gridX: 2, gridY: 2, name: 'Level 4-2' },
      { id: '4-3', type: 'level', levelNum: 3, gridX: 3, gridY: 2, name: 'Level 4-3' },
      { id: '4-4', type: 'level', levelNum: 4, gridX: 4, gridY: 2, name: 'Level 4-4' },
      { id: '4-5', type: 'level', levelNum: 5, gridX: 4, gridY: 3, name: 'Level 4-5' },
      { id: '4-6', type: 'level', levelNum: 6, gridX: 5, gridY: 3, name: 'Level 4-6' },
      { id: '4-7', type: 'level', levelNum: 7, gridX: 6, gridY: 3, name: 'Level 4-7' },
      { id: '4-8', type: 'level', levelNum: 8, gridX: 6, gridY: 2, name: 'Level 4-8' },
      { id: '4-9', type: 'level', levelNum: 9, gridX: 7, gridY: 2, name: 'Level 4-9' },
      { id: '4-10', type: 'fortress', levelNum: 10, gridX: 8, gridY: 2, name: 'Level 4-10 Citadel Castle' },
    ]
  }
];

// Generate Level Data for World W, Level L (250 tiles wide)
export function getLevelData(worldIndex = 0, levelIndex = 0) {
  const world = WORLDS[worldIndex % WORLDS.length];
  const levelNum = (levelIndex % 10) + 1;

  const platforms = [
    // Ground floor
    { x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND },
  ];

  const mice = [];
  const dogs = [];

  // Generate 250-tile long level sections procedurally based on levelNum & theme
  for (let sec = 0; sec < 12; sec++) {
    const startX = 15 + sec * 20;

    // Platform pattern
    if (sec % 2 === 0) {
      platforms.push({ x: startX, y: 12, w: 5, h: 1, type: world.theme === 'yarn' ? TILE.YARN_BALL : world.theme === 'fish' ? TILE.LILY_PAD : TILE.GROUND });
      platforms.push({ x: startX + 6, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM });
      platforms.push({ x: startX + 7, y: 10, w: 3, h: 1, type: TILE.BRICK });
    } else {
      platforms.push({ x: startX, y: 11, w: 6, h: 1, type: TILE.GROUND });
      platforms.push({ x: startX + 8, y: 10, w: 1, h: 1, type: TILE.BLOCK_ITEM });
    }

    // Spawn Mice
    mice.push({ tileX: startX + 2, tileY: 10 });

    // Spawn Dog Enemies
    const dogType = sec % 3 === 0 ? 'bulldog' : sec % 3 === 1 ? 'corgi' : 'chihuahua';
    const speed = 1.2 + (levelNum * 0.1) + (sec % 2) * 0.5;
    dogs.push({ type: dogType, tileX: startX + 5, tileY: 14, range: 6, speed });
  }

  return {
    worldIndex,
    levelIndex,
    name: `${world.name} - Level ${worldIndex + 1}-${levelNum}`,
    theme: world.theme,
    bgColor: world.bgColor,
    skyColor: world.skyColor,
    groundColor: world.groundColor,
    platformColor: world.platformColor,
    width: 250,
    height: 18,
    spawnP1: { tileX: 3, tileY: 13 },
    spawnP2: { tileX: 5, tileY: 13 },
    goalX: 240,
    mice,
    dogs,
    platforms,
  };
}
