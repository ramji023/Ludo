export const checkType = (grid: string, gridObject: Record<string, string[]>) => {
  return (
    Object.keys(gridObject).find((key) => gridObject[key].includes(grid)) ||
    null
  );
};
