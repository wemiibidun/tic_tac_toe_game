import {
  calculateWinner,
  getComputerMove,
  getWinningLine,
  isBoardFull,
} from "./gameLogic";

test("calculateWinner detects a row win", () => {
  const board = ["X", "X", "X", null, null, null, null, null, null];
  expect(calculateWinner(board)).toBe("X");
  expect(getWinningLine(board)).toEqual([0, 1, 2]);
});

test("calculateWinner returns null when no winner", () => {
  const board = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
  expect(calculateWinner(board)).toBe(null);
  expect(isBoardFull(board)).toBe(true);
});

test("cpu hard chooses winning move", () => {
  const board = ["O", "O", null, "X", "X", null, null, null, null];
  expect(getComputerMove(board, "cpu-hard")).toBe(2);
});
