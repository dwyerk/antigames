// Arcade Endless Rush & Daily Challenge Generator
import { ELEMENT } from '../engine/constants.js';
import { BOTTLE_TYPES } from '../levels/bottles.js';

function pseudoRandom(seedString) {
  let h = 0;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(31, h) + seedString.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(48271, h) % 2147483647;
    return (h & 2147483647) / 2147483647;
  };
}

export function generateArcadeLevel(stageNumber = 1) {
  const bottleList = Object.values(BOTTLE_TYPES);
  const bottleType = bottleList[(stageNumber - 1) % bottleList.length];

  const goalsCount = Math.min(3, 1 + Math.floor((stageNumber - 1) / 3));

  const structures = [];
  const goalPositions = [
    { x: 120, y: 50 },
    { x: 80, y: 110 },
    { x: 160, y: 110 },
  ];

  for (let i = 1; i <= goalsCount; i++) {
    const pos = goalPositions[i - 1];
    const goalType = ELEMENT[`GOAL_${i}`];
    structures.push({ x: pos.x, y: pos.y, type: goalType });
  }

  // Pick stream elements for this stage
  const streamPool = [ELEMENT.GRAV_SAND, ELEMENT.ANTI_GRAV, ELEMENT.LASER_SAND, ELEMENT.ELECTRICITY];
  const selectedStream = streamPool[(stageNumber - 1) % streamPool.length];

  return {
    id: `arcade_${stageNumber}`,
    title: `Arcade Stage ${stageNumber}`,
    bottleType,
    goalsCount,
    desc: `Stage ${stageNumber}: Guide your continuous stream to hit all ${goalsCount} Goal Switches before time runs out!`,
    streamSequence: [selectedStream],
    structures,
  };
}

export function generateDailyChallenge() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const rng = pseudoRandom(todayStr);

  const bottleList = Object.values(BOTTLE_TYPES);
  const bottleType = bottleList[Math.floor(rng() * bottleList.length)];

  const goalsCount = 3;
  const structures = [
    { x: 70 + Math.floor(rng() * 40), y: 40 + Math.floor(rng() * 30), type: ELEMENT.GOAL_1 },
    { x: 130 + Math.floor(rng() * 40), y: 70 + Math.floor(rng() * 30), type: ELEMENT.GOAL_2 },
    { x: 90 + Math.floor(rng() * 60), y: 120 + Math.floor(rng() * 20), type: ELEMENT.GOAL_3 },
  ];

  if (rng() > 0.4) {
    structures.push({ x: 60, y: 60, type: ELEMENT.PORTAL_A });
    structures.push({ x: 180, y: 100, type: ELEMENT.PORTAL_B });
  }

  return {
    id: `daily_${todayStr}`,
    title: `Daily Challenge - ${todayStr}`,
    bottleType,
    goalsCount,
    desc: `Daily Challenge for ${todayStr}! Guide your continuous particle stream through today's seeded layout.`,
    streamSequence: [ELEMENT.GRAV_SAND, ELEMENT.ANTI_GRAV, ELEMENT.LASER_SAND],
    structures,
  };
}
