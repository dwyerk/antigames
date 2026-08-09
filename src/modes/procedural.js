// Procedural Sand Art Target Pattern Generator & Accuracy Evaluator
import { ELEMENT, ELEMENT_COLORS, ELEMENT_INFO } from '../engine/constants.js';

// Standard gravity sands for bottom and middle layers
const FALLING_SAND_COLORS = [
  ELEMENT.SAND_GOLD,
  ELEMENT.SAND_BLUE,
  ELEMENT.SAND_PINK,
  ELEMENT.SAND_GREEN,
  ELEMENT.LAVA,
];

// Simple PRNG from seed for deterministic stage patterns
function pseudoRandom(seed) {
  let h = seed;
  return function() {
    h = Math.imul(48271, h) % 2147483647;
    return (h & 2147483647) / 2147483647;
  };
}

export function generateTargetDesign(stageNum = 1) {
  const rng = pseudoRandom(stageNum * 9301 + 49297);

  // Number of color layers increases with stage (2 -> 5 layers)
  const layerCount = Math.min(5, 2 + Math.floor((stageNum - 1) / 2));
  const targetTotalPct = Math.min(85, 65 + Math.floor((stageNum - 1) / 3) * 5);

  const layerPctEach = targetTotalPct / layerCount;
  const layers = [];

  let lastColor = null;
  for (let i = 0; i < layerCount; i++) {
    const isTopLayer = (i === layerCount - 1);

    // Anti-Grav sand is ONLY allowed for the top layer since it floats upwards!
    const allowedColors = isTopLayer
      ? [...FALLING_SAND_COLORS, ELEMENT.ANTI_GRAV]
      : FALLING_SAND_COLORS;

    let color;
    do {
      color = allowedColors[Math.floor(rng() * allowedColors.length)];
    } while (color === lastColor && allowedColors.length > 1);

    lastColor = color;
    layers.push({
      color,
      name: ELEMENT_INFO[color]?.name || 'Sand',
      icon: ELEMENT_INFO[color]?.icon || '⏳',
      colorHex: ELEMENT_COLORS[color],
      pct: layerPctEach,
      startPct: i * layerPctEach,
      endPct: (i + 1) * layerPctEach,
    });
  }

  return {
    stageNum,
    targetTotalPct,
    layerCount,
    layers,
  };
}

// Evaluate player sand pattern accuracy (0 - 100%) against target design
export function evaluateAccuracy(grid, width, height, innerMask, targetDesign) {
  if (!innerMask || !targetDesign || targetDesign.layers.length === 0) return 0;

  let totalInnerPixels = 0;
  let correctPixels = 0;

  const layers = targetDesign.layers;

  // Scan grid rows from bottom (y = height - 25) upwards
  const bottomY = height - 25;
  const totalVolumeY = 110;

  for (let y = 0; y < height; y++) {
    const rowPctFromBottom = Math.max(0, Math.min(100, ((bottomY - y) / totalVolumeY) * 100));
    const targetLayer = layers.find(l => rowPctFromBottom >= l.startPct && rowPctFromBottom < l.endPct);

    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (innerMask[idx] === 1) {
        const particleType = grid[idx];

        if (targetLayer) {
          totalInnerPixels++;
          if (particleType === targetLayer.color) {
            correctPixels += 1.0;
          } else if (particleType !== ELEMENT.EMPTY) {
            correctPixels += 0.2;
          }
        }
      }
    }
  }

  if (totalInnerPixels === 0) return 0;
  const rawPct = Math.floor((correctPixels / totalInnerPixels) * 100);
  return Math.max(0, Math.min(100, rawPct));
}
