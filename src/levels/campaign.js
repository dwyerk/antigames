// Handcrafted Campaign Levels for Antigravity Sand: Kinetic Chain
import { ELEMENT } from '../engine/constants.js';
import { BOTTLE_TYPES } from './bottles.js';

export const CAMPAIGN_LEVELS = [
  {
    id: 1,
    title: 'Level 1: The First Cascade',
    bottleType: BOTTLE_TYPES.FLASK,
    goalsCount: 1,
    desc: 'Move your cursor to pour a continuous stream of Grav-Sand through the bottle neck into Goal #1!',
    streamSequence: [ELEMENT.GRAV_SAND],
    structures: [
      { x: 120, y: 135, type: ELEMENT.GOAL_1 },
    ]
  },
  {
    id: 2,
    title: 'Level 2: Dual Gravity Streams',
    bottleType: BOTTLE_TYPES.HOURGLASS,
    goalsCount: 2,
    desc: 'Switch streams! Pour Anti-Grav Sand to float into Goal #1, then Grav-Sand down to Goal #2.',
    streamSequence: [ELEMENT.ANTI_GRAV, ELEMENT.GRAV_SAND],
    structures: [
      { x: 120, y: 35, type: ELEMENT.GOAL_1 },
      { x: 120, y: 135, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 3,
    title: 'Level 3: Sloped Ramps',
    bottleType: BOTTLE_TYPES.BEAKER,
    goalsCount: 2,
    desc: 'Guide your continuous sand stream across sloped ramps to strike Goal #1 and Goal #2!',
    streamSequence: [ELEMENT.GRAV_SAND],
    structures: [
      { x: 70, y: 80, type: ELEMENT.RAMP_RIGHT },
      { x: 170, y: 100, type: ELEMENT.RAMP_LEFT },
      { x: 60, y: 135, type: ELEMENT.GOAL_1 },
      { x: 180, y: 135, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 4,
    title: 'Level 4: Portal Stream',
    bottleType: BOTTLE_TYPES.POTION,
    goalsCount: 2,
    desc: 'Pour sand into Portal Alpha (Blue). The stream teleports out of Portal Beta (Orange) into Goal #2!',
    streamSequence: [ELEMENT.GRAV_SAND],
    structures: [
      { x: 120, y: 60, type: ELEMENT.PORTAL_A },
      { x: 70, y: 110, type: ELEMENT.PORTAL_B },
      { x: 120, y: 130, type: ELEMENT.GOAL_1 },
      { x: 70, y: 135, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 5,
    title: 'Level 5: Laser Beam Emitter',
    bottleType: BOTTLE_TYPES.DIAMOND,
    goalsCount: 2,
    desc: 'Your cursor now streams Laser-Sand! Sweep the beam stream across the diamond chamber into Goal #1 & #2.',
    streamSequence: [ELEMENT.LASER_SAND],
    structures: [
      { x: 80, y: 80, type: ELEMENT.GOAL_1 },
      { x: 160, y: 80, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 6,
    title: 'Level 6: Electric Current',
    bottleType: BOTTLE_TYPES.BEAKER,
    goalsCount: 2,
    desc: 'Stream Electricity along the Conductor wire to unlock the Kinetic Door and hit Goal #2!',
    streamSequence: [ELEMENT.ELECTRICITY, ELEMENT.GRAV_SAND],
    structures: [
      // Conductor wire
      { x: 60, y: 70, type: ELEMENT.CONDUCTOR },
      { x: 70, y: 70, type: ELEMENT.CONDUCTOR },
      { x: 80, y: 70, type: ELEMENT.CONDUCTOR },
      { x: 90, y: 70, type: ELEMENT.CONDUCTOR },
      { x: 100, y: 70, type: ELEMENT.CONDUCTOR },
      { x: 100, y: 70, type: ELEMENT.GOAL_1 },
      // Kinetic door blocking goal 2
      { x: 150, y: 110, type: ELEMENT.KINETIC_DOOR },
      { x: 150, y: 111, type: ELEMENT.KINETIC_DOOR },
      { x: 150, y: 112, type: ELEMENT.KINETIC_DOOR },
      { x: 150, y: 113, type: ELEMENT.KINETIC_DOOR },
      { x: 150, y: 114, type: ELEMENT.KINETIC_DOOR },
      { x: 180, y: 120, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 7,
    title: 'Level 7: Anti-Matter Blast',
    bottleType: BOTTLE_TYPES.HOURGLASS,
    goalsCount: 2,
    desc: 'Pour Anti-Matter to blast open structural barriers, then stream Grav-Sand into Goal #2!',
    streamSequence: [ELEMENT.ANTI_MATTER, ELEMENT.GRAV_SAND],
    structures: [
      { x: 120, y: 80, type: ELEMENT.GOAL_1 },
      // Barrier
      { x: 110, y: 110, type: ELEMENT.RAMP_LEFT },
      { x: 120, y: 110, type: ELEMENT.RAMP_RIGHT },
      { x: 120, y: 135, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 8,
    title: 'Level 8: Magnetic Pull',
    bottleType: BOTTLE_TYPES.FLASK,
    goalsCount: 2,
    desc: 'Magnetite fields are active! Sweep your sand stream so magnetic gravity pulls particles into Goal #1 and #2.',
    streamSequence: [ELEMENT.GRAV_SAND],
    structures: [
      { x: 120, y: 70, type: ELEMENT.MAGNETITE },
      { x: 70, y: 110, type: ELEMENT.GOAL_1 },
      { x: 170, y: 110, type: ELEMENT.GOAL_2 },
    ]
  },
  {
    id: 9,
    title: 'Level 9: The Multi-Stream Loop',
    bottleType: BOTTLE_TYPES.POTION,
    goalsCount: 3,
    desc: 'Sequence: Stream Anti-Grav to Goal #1 -> Stream Grav-Sand into Portal for Goal #2 -> Laser-Sand into #3!',
    streamSequence: [ELEMENT.ANTI_GRAV, ELEMENT.GRAV_SAND, ELEMENT.LASER_SAND],
    structures: [
      { x: 120, y: 40, type: ELEMENT.GOAL_1 },
      { x: 60, y: 110, type: ELEMENT.PORTAL_A },
      { x: 180, y: 60, type: ELEMENT.PORTAL_B },
      { x: 180, y: 90, type: ELEMENT.GOAL_2 },
      { x: 120, y: 135, type: ELEMENT.GOAL_3 },
    ]
  },
  {
    id: 10,
    title: 'Level 10: Cosmic Hourglass',
    bottleType: BOTTLE_TYPES.HOURGLASS,
    goalsCount: 3,
    desc: 'Triple stream challenge: Fire Laser -> Spark Conductor -> Animate Anti-Grav.',
    streamSequence: [ELEMENT.LASER_SAND, ELEMENT.ELECTRICITY, ELEMENT.ANTI_GRAV],
    structures: [
      { x: 70, y: 45, type: ELEMENT.GOAL_1 },
      { x: 120, y: 80, type: ELEMENT.GOAL_2 },
      { x: 170, y: 135, type: ELEMENT.GOAL_3 },
    ]
  },
  {
    id: 11,
    title: 'Level 11: Laser Mirror Stream',
    bottleType: BOTTLE_TYPES.BEAKER,
    goalsCount: 3,
    desc: 'Bounce continuous laser streams off fixed ramps to trigger 3 goal nodes in succession.',
    streamSequence: [ELEMENT.LASER_SAND],
    structures: [
      { x: 100, y: 60, type: ELEMENT.RAMP_RIGHT },
      { x: 140, y: 100, type: ELEMENT.RAMP_LEFT },
      { x: 50, y: 60, type: ELEMENT.GOAL_1 },
      { x: 190, y: 90, type: ELEMENT.GOAL_2 },
      { x: 50, y: 130, type: ELEMENT.GOAL_3 },
    ]
  },
  {
    id: 12,
    title: 'Level 12: Kinetic Overdrive',
    bottleType: BOTTLE_TYPES.DIAMOND,
    goalsCount: 3,
    desc: 'Combine Electricity, Portals, and Magnetite streams to conquer the diamond chamber.',
    streamSequence: [ELEMENT.ELECTRICITY, ELEMENT.GRAV_SAND, ELEMENT.ANTI_GRAV],
    structures: [
      { x: 120, y: 40, type: ELEMENT.GOAL_1 },
      { x: 70, y: 100, type: ELEMENT.GOAL_2 },
      { x: 170, y: 100, type: ELEMENT.GOAL_3 },
    ]
  },
  {
    id: 13,
    title: 'Level 13: Quantum Annihilation',
    bottleType: BOTTLE_TYPES.FLASK,
    goalsCount: 3,
    desc: 'Clear anti-matter walls while triggering goals 1, 2, and 3 in exact order!',
    streamSequence: [ELEMENT.ANTI_MATTER, ELEMENT.GRAV_SAND, ELEMENT.LASER_SAND],
    structures: [
      { x: 120, y: 70, type: ELEMENT.GOAL_1 },
      { x: 70, y: 130, type: ELEMENT.GOAL_2 },
      { x: 170, y: 130, type: ELEMENT.GOAL_3 },
    ]
  },
  {
    id: 14,
    title: 'Level 14: Potion Flow',
    bottleType: BOTTLE_TYPES.POTION,
    goalsCount: 3,
    desc: 'Navigate the curved potion bottle with continuous streams of Grav-Sand & Anti-Grav.',
    streamSequence: [ELEMENT.GRAV_SAND, ELEMENT.ANTI_GRAV],
    structures: [
      { x: 120, y: 50, type: ELEMENT.GOAL_1 },
      { x: 75, y: 120, type: ELEMENT.GOAL_2 },
      { x: 165, y: 120, type: ELEMENT.GOAL_3 },
    ]
  },
  {
    id: 15,
    title: 'Level 15: Grand Master Stream',
    bottleType: BOTTLE_TYPES.HOURGLASS,
    goalsCount: 3,
    desc: 'The ultimate stream master test! Synchronize sand, lasers, anti-matter & electricity.',
    streamSequence: [ELEMENT.GRAV_SAND, ELEMENT.ANTI_GRAV, ELEMENT.LASER_SAND, ELEMENT.ELECTRICITY],
    structures: [
      { x: 120, y: 35, type: ELEMENT.GOAL_1 },
      { x: 120, y: 80, type: ELEMENT.GOAL_2 },
      { x: 120, y: 140, type: ELEMENT.GOAL_3 },
    ]
  }
];
