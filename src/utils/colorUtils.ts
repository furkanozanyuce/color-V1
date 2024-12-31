export const generateHSLColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 60;
  const lightness = Math.floor(Math.random() * 20) + 40;
  return { hue, saturation, lightness };
};

export const getGridSize = (level: number): number => {
  if (level === 1) return 2;
  if (level === 2) return 3;
  if (level === 3) return 4;
  if (level === 4) return 5;
  return 6; // Level 5 and beyond
};

export const generateColors = (level: number) => {
  const { hue, saturation, lightness } = generateHSLColor();
  const difficulty = Math.max(8 - Math.floor(level / 2), 3);
  const variation = Math.random() < 0.5 ? difficulty : -difficulty;
  
  const baseColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const targetColor = `hsl(${hue}, ${saturation}%, ${lightness + variation}%)`;
  
  const gridSize = getGridSize(level);
  const targetIndex = Math.floor(Math.random() * (gridSize * gridSize));
  
  return { baseColor, targetColor, targetIndex, gridSize };
};