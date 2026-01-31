export const pawnPosition = [
  //from blue side ---> full ideal and comman path for every pawns
  { x: 0, y: 240, index: 0 },
  { x: 40, y: 240, index: 1, isHome: true, home: "blue" },
  { x: 80, y: 240, index: 2 },
  { x: 120, y: 240, index: 3 },
  { x: 160, y: 240, index: 4 },
  { x: 200, y: 240, index: 5 },

  { x: 240, y: 200, index: 6 },
  { x: 240, y: 160, index: 7 },
  { x: 240, y: 120, index: 8 },
  { x: 240, y: 80, index: 9, isSafe: true },
  { x: 240, y: 40, index: 10 },
  { x: 240, y: 0, index: 11 },

  { x: 280, y: 0, index: 12, isVictoryPathStart: true, victoryPath: "yellow" },

  { x: 320, y: 0, index: 13 },
  { x: 320, y: 40, index: 14, isHome: true, home: "yellow" },
  { x: 320, y: 80, index: 15 },
  { x: 320, y: 120, index: 16 },
  { x: 320, y: 160, index: 17 },
  { x: 320, y: 200, index: 18 },

  { x: 360, y: 240, index: 19 },
  { x: 400, y: 240, index: 20 },
  { x: 440, y: 240, index: 21 },
  { x: 480, y: 240, index: 22, isSafe: true },
  { x: 520, y: 240, index: 23 },
  { x: 560, y: 240, index: 24 },

  { x: 560, y: 280, index: 25, isVictoryPathStart: true, victoryPath: "green" },

  { x: 560, y: 320, index: 26 },
  { x: 520, y: 320, index: 27, isHome: true, home: "green" },
  { x: 480, y: 320, index: 28 },
  { x: 440, y: 320, index: 29 },
  { x: 400, y: 320, index: 30 },
  { x: 360, y: 320, index: 31 },

  { x: 320, y: 360, index: 32 },
  { x: 320, y: 400, index: 33 },
  { x: 320, y: 440, index: 34 },
  { x: 320, y: 480, index: 35, isSafe: true },
  { x: 320, y: 520, index: 36 },
  { x: 320, y: 560, index: 37 },

  { x: 280, y: 560, index: 38, isVictoryPathStart: true, victoryPath: "red" },

  { x: 240, y: 560, index: 39 },
  { x: 240, y: 520, index: 40, isHome: true, home: "red" },
  { x: 240, y: 480, index: 41 },
  { x: 240, y: 440, index: 42 },
  { x: 240, y: 400, index: 43 },
  { x: 240, y: 360, index: 44 },

  { x: 200, y: 320, index: 45 },
  { x: 160, y: 320, index: 46 },
  { x: 120, y: 320, index: 47 },
  { x: 80, y: 320, index: 48, isSafe: true },
  { x: 40, y: 320, index: 49 },
  { x: 0, y: 320, index: 50 },

  { x: 0, y: 280, index: 51, isVictoryPathStart: true, victoryPath: "blue" },
];

export const redVictoryPath = [
  // { x: 280, y: 520, index: 52 },
  // { x: 280, y: 480, index: 53 },
  // { x: 280, y: 440, index: 54 },
  // { x: 280, y: 400, index: 55 },
  // { x: 280, y: 360, index: 56 },
  { x: 280, y: 520, index: 0 },
  { x: 280, y: 480, index: 1 },
  { x: 280, y: 440, index: 2 },
  { x: 280, y: 400, index: 3 },
  { x: 280, y: 360, index: 4 },
];

export const blueVictoryPath = [
  // { x: 40, y: 280, index: 57 },
  // { x: 80, y: 280, index: 58 },
  // { x: 120, y: 280, index: 59 },
  // { x: 160, y: 280, index: 60 },
  // { x: 200, y: 280, index: 61 },
  { x: 40, y: 280, index: 0 },
  { x: 80, y: 280, index: 1 },
  { x: 120, y: 280, index: 2 },
  { x: 160, y: 280, index: 3 },
  { x: 200, y: 280, index: 4 },
];

export const yellowVictoryPath = [
  // { x: 280, y: 40, index: 62 },
  // { x: 280, y: 80, index: 63 },
  // { x: 280, y: 120, index: 64 },
  // { x: 280, y: 160, index: 65 },
  // { x: 280, y: 200, index: 66 },

  { x: 280, y: 40, index: 0 },
  { x: 280, y: 80, index: 1 },
  { x: 280, y: 120, index: 2 },
  { x: 280, y: 160, index: 3 },
  { x: 280, y: 200, index: 4 },
];

export const greenVictoryPath = [
  // { x: 520, y: 280, index: 67 },
  // { x: 480, y: 280, index: 68 },
  // { x: 440, y: 280, index: 69 },
  // { x: 400, y: 280, index: 70 },
  // { x: 360, y: 280, index: 71 },
  { x: 520, y: 280, index: 0 },
  { x: 480, y: 280, index: 1 },
  { x: 440, y: 280, index: 2 },
  { x: 400, y: 280, index: 3 },
  { x: 360, y: 280, index: 4 },
];

export const victoryPathMap: Record<string, any[]> = {
  red: redVictoryPath,
  blue: blueVictoryPath,
  yellow: yellowVictoryPath,
  green: greenVictoryPath,
};

export const blueHomePosition = [
  { x: 60, y: 60, index: 0 },
  { x: 180, y: 60, index: 1 },
  { x: 60, y: 180, index: 2 },
  { x: 180, y: 180, index: 3 },
];

export const yellowHomePosition = [
  { x: 420, y: 60, index: 0 },
  { x: 540, y: 60, index: 1 },
  { x: 420, y: 180, index: 2 },
  { x: 540, y: 180, index: 3 },
];

export const redHomePosition = [
  { x: 60, y: 420, index: 0 },
  { x: 180, y: 420, index: 1 },
  { x: 60, y: 540, index: 2 },
  { x: 180, y: 540, index: 3 },
];

export const greenHomePosition = [
  { x: 420, y: 420, index: 0 },
  { x: 540, y: 420, index: 1 },
  { x: 420, y: 540, index: 2 },
  { x: 540, y: 540, index: 3 },
];

export const homePosition: Record<
  string,
  {
    x: number;
    y: number;
    index: number;
  }[]
> = {
  red: redHomePosition,
  yellow: yellowHomePosition,
  green: greenHomePosition,
  blue: blueHomePosition,
};

export const victoryBox: Record<string, string> = {
  blue: "240,240 240,360 300,300",
  green: "360,240 360,360 300,300",
  yellow: "240,240 360,240 300,300",
  red: "240,360 360,360 300,300",
};

export const colors: Record<string, string> = {
  blue: "#0dceff",
  yellow: "#ffcf04",
  green: "#029834",
  red: "#fe0000",
};
