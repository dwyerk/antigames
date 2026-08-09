// Clean Simple Geometric Glass Vessel Shapes for Arcade Sand Filling
import { GRID_WIDTH, GRID_HEIGHT, ELEMENT } from '../engine/constants.js';

export const VESSEL_TYPES = {
  JAR: 'jar',           // Simple rectangular glass jar
  CYLINDER: 'cylinder', // Tall narrow cylinder
  FUNNEL: 'funnel',     // Wide top, tapered bottom
  BOWL: 'bowl',         // Wide rounded bottom
  FLASK: 'flask',       // Classic tapered beaker
  HOURGLASS: 'hourglass'// Two connected chambers
};

// Helper to draw 3-pixel thick leak-proof glass walls
function setThickWall(mask, y, leftX, rightX) {
  for (let w = -1; w <= 1; w++) {
    if (leftX + w >= 0 && leftX + w < GRID_WIDTH) {
      mask[y][leftX + w] = ELEMENT.BOTTLE;
    }
    if (rightX + w >= 0 && rightX + w < GRID_WIDTH) {
      mask[y][rightX + w] = ELEMENT.BOTTLE;
    }
  }
}

export function generateVesselMask(type = VESSEL_TYPES.JAR) {
  const mask = new Array(GRID_HEIGHT).fill(0).map(() => new Array(GRID_WIDTH).fill(0));
  const innerMask = new Uint8Array(GRID_WIDTH * GRID_HEIGHT);
  const cx = Math.floor(GRID_WIDTH / 2);
  const margin = 20;

  switch (type) {
    case VESSEL_TYPES.CYLINDER: {
      const topY = margin + 10;
      const bottomY = GRID_HEIGHT - margin;
      const halfW = 35;

      const leftX = cx - halfW;
      const rightX = cx + halfW;

      for (let y = topY; y <= bottomY; y++) {
        setThickWall(mask, y, leftX, rightX);
      }
      for (let x = leftX - 1; x <= rightX + 1; x++) {
        mask[bottomY][x] = ELEMENT.BOTTLE;
        mask[bottomY - 1][x] = ELEMENT.BOTTLE;
      }
      break;
    }

    case VESSEL_TYPES.FUNNEL: {
      const topY = margin + 15;
      const bottomY = GRID_HEIGHT - margin - 5;
      const topW = 120;
      const botW = 40;

      for (let y = topY; y <= bottomY; y++) {
        const t = (y - topY) / (bottomY - topY);
        const halfW = Math.floor((topW / 2) * (1 - t) + (botW / 2) * t);
        const leftX = Math.max(margin, cx - halfW);
        const rightX = Math.min(GRID_WIDTH - margin, cx + halfW);

        setThickWall(mask, y, leftX, rightX);
      }
      for (let x = cx - botW / 2 - 1; x <= cx + botW / 2 + 1; x++) {
        const bx = Math.floor(x);
        mask[bottomY][bx] = ELEMENT.BOTTLE;
        mask[bottomY - 1][bx] = ELEMENT.BOTTLE;
      }
      break;
    }

    case VESSEL_TYPES.BOWL: {
      const topY = margin + 20;
      const bottomY = GRID_HEIGHT - margin - 5;
      const halfW = 65;

      const leftX = cx - halfW;
      const rightX = cx + halfW;

      for (let y = topY; y <= bottomY; y++) {
        setThickWall(mask, y, leftX, rightX);
      }
      for (let x = leftX - 1; x <= rightX + 1; x++) {
        mask[bottomY][x] = ELEMENT.BOTTLE;
        mask[bottomY - 1][x] = ELEMENT.BOTTLE;
      }
      break;
    }

    case VESSEL_TYPES.FLASK: {
      const topY = margin + 20;
      const neckBottomY = topY + 25;
      const bottomY = GRID_HEIGHT - margin - 5;
      const neckW = 30;
      const baseW = 110;

      for (let y = topY; y <= bottomY; y++) {
        let halfW;
        if (y < neckBottomY) {
          halfW = neckW / 2;
        } else {
          const t = (y - neckBottomY) / (bottomY - neckBottomY);
          halfW = (neckW / 2) * (1 - t) + (baseW / 2) * t;
        }
        halfW = Math.floor(halfW);
        const leftX = cx - halfW;
        const rightX = cx + halfW;

        setThickWall(mask, y, leftX, rightX);
      }
      for (let x = cx - baseW / 2 - 1; x <= cx + baseW / 2 + 1; x++) {
        const bx = Math.floor(x);
        mask[bottomY][bx] = ELEMENT.BOTTLE;
        mask[bottomY - 1][bx] = ELEMENT.BOTTLE;
      }
      break;
    }

    case VESSEL_TYPES.HOURGLASS: {
      const topY = margin + 15;
      const midY = Math.floor(GRID_HEIGHT / 2);
      const bottomY = GRID_HEIGHT - margin - 5;
      const maxW = 90;
      const minW = 20;

      for (let y = topY; y <= bottomY; y++) {
        let halfW;
        if (y < midY) {
          const t = (y - topY) / (midY - topY);
          halfW = (maxW / 2) * (1 - t) + (minW / 2) * t;
        } else {
          const t = (y - midY) / (bottomY - midY);
          halfW = (minW / 2) * (1 - t) + (maxW / 2) * t;
        }
        halfW = Math.floor(halfW);
        const leftX = Math.max(margin, cx - halfW);
        const rightX = Math.min(GRID_WIDTH - margin, cx + halfW);

        setThickWall(mask, y, leftX, rightX);
      }
      for (let x = cx - maxW / 2 - 1; x <= cx + maxW / 2 + 1; x++) {
        const bx = Math.floor(x);
        mask[bottomY][bx] = ELEMENT.BOTTLE;
        mask[bottomY - 1][bx] = ELEMENT.BOTTLE;
      }
      break;
    }

    default: // JAR (Standard rectangular glass jar)
    case VESSEL_TYPES.JAR: {
      const topY = margin + 15;
      const bottomY = GRID_HEIGHT - margin - 5;
      const leftX = margin + 30;
      const rightX = GRID_WIDTH - margin - 30;

      for (let y = topY; y <= bottomY; y++) {
        setThickWall(mask, y, leftX, rightX);
      }
      for (let x = leftX - 1; x <= rightX + 1; x++) {
        mask[bottomY][x] = ELEMENT.BOTTLE;
        mask[bottomY - 1][x] = ELEMENT.BOTTLE;
      }
      break;
    }
  }

  // Calculate interior mask & total inner capacity cells
  let totalInnerCells = 0;
  for (let y = 0; y < GRID_HEIGHT; y++) {
    let leftWall = -1;
    let rightWall = -1;

    for (let x = 0; x < GRID_WIDTH; x++) {
      if (mask[y][x] === ELEMENT.BOTTLE) {
        if (leftWall === -1) {
          leftWall = x;
        }
        rightWall = x;
      }
    }

    if (leftWall !== -1 && rightWall !== -1 && rightWall - leftWall > 2) {
      for (let x = leftWall + 1; x < rightWall; x++) {
        if (mask[y][x] === 0) {
          innerMask[y * GRID_WIDTH + x] = 1;
          totalInnerCells++;
        }
      }
    }
  }

  return { mask, innerMask, capacity: Math.max(500, totalInnerCells) };
}
