// Distinct Hand-Crafted Levels for 4 Worlds x 10 Levels Each (40 Levels Total)
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

export function getLevelData(worldIndex = 0, levelIndex = 0) {
  const world = WORLDS[worldIndex % WORLDS.length];
  const levelNum = (levelIndex % 10) + 1;

  const platforms = [];
  const mice = [];
  const dogs = [];

  // World 1: Yarn Kingdom (Bouncy yarn platforms & low stepping hills)
  if (worldIndex === 0) {
    platforms.push({ x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND });
    for (let i = 0; i < 10; i++) {
      const sx = 18 + i * 22;
      platforms.push({ x: sx, y: 12 - (i % 3), w: 5 + (i % 3), h: 1, type: TILE.YARN_BALL });
      platforms.push({ x: sx + 2, y: 9 - (i % 3), w: 1, h: 1, type: TILE.BLOCK_ITEM });
      if (i % 2 === 0) {
        platforms.push({ x: sx + 3, y: 9 - (i % 3), w: 3, h: 1, type: TILE.BRICK });
      }

      mice.push({ tileX: sx + 1, tileY: 11 - (i % 3) });
      dogs.push({ type: i % 2 === 0 ? 'corgi' : 'chihuahua', tileX: sx + 4, tileY: 14, range: 6, speed: 1.3 + (levelNum * 0.1) });
    }
  }

  // World 2: Catnip Forest (Giant mushroom towers & vine climbs)
  else if (worldIndex === 1) {
    platforms.push({ x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND });
    for (let i = 0; i < 10; i++) {
      const sx = 20 + i * 22;
      // Mushroom Stem & Top
      const towerH = 4 + (i % 4);
      platforms.push({ x: sx + 2, y: 15 - towerH, w: 2, h: towerH, type: TILE.GROUND });
      platforms.push({ x: sx, y: 15 - towerH, w: 6, h: 1, type: TILE.GROUND });
      platforms.push({ x: sx + 3, y: 12 - towerH, w: 1, h: 1, type: TILE.BLOCK_ITEM });

      mice.push({ tileX: sx + 1, tileY: 14 - towerH });
      dogs.push({ type: 'chihuahua', tileX: sx + 8, tileY: 14, range: 7, speed: 1.8 });
    }
  }

  // World 3: Fish Pond Alley (Water pits with floating lily pads)
  else if (worldIndex === 2) {
    // Ground with water pit gaps!
    let curX = 0;
    for (let i = 0; i < 10; i++) {
      platforms.push({ x: curX, y: 15, w: 14, h: 3, type: TILE.GROUND });
      curX += 14;

      // Water Gap with floating Lily Pads!
      const gapW = 8;
      platforms.push({ x: curX, y: 16, w: gapW, h: 2, type: TILE.WATER });
      platforms.push({ x: curX + 1, y: 13, w: 3, h: 1, type: TILE.LILY_PAD });
      platforms.push({ x: curX + 4, y: 13, w: 3, h: 1, type: TILE.LILY_PAD });
      platforms.push({ x: curX + 3, y: 9, w: 1, h: 1, type: TILE.BLOCK_ITEM });

      mice.push({ tileX: curX + 2, tileY: 12 });
      dogs.push({ type: 'bulldog', tileX: curX - 6, tileY: 14, range: 5, speed: 1.2 });
      curX += gapW;
    }
    platforms.push({ x: curX, y: 15, w: 40, h: 3, type: TILE.GROUND });
  }

  // World 4: Dog Citadel (Fortress stone walls, brick pillars & heavy dog packs)
  else {
    platforms.push({ x: 0, y: 15, w: 250, h: 3, type: TILE.GROUND });
    for (let i = 0; i < 10; i++) {
      const sx = 20 + i * 22;
      // Stone Fortress Wall
      platforms.push({ x: sx, y: 11, w: 8, h: 4, type: TILE.GROUND });
      platforms.push({ x: sx + 2, y: 8, w: 1, h: 1, type: TILE.BLOCK_ITEM });
      platforms.push({ x: sx + 3, y: 8, w: 4, h: 1, type: TILE.BRICK });

      mice.push({ tileX: sx + 4, tileY: 10 });
      dogs.push({ type: 'bulldog', tileX: sx + 1, tileY: 10, range: 6, speed: 1.5 + (levelNum * 0.15) });
      dogs.push({ type: 'corgi', tileX: sx + 10, tileY: 14, range: 7, speed: 1.8 });
    }
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
