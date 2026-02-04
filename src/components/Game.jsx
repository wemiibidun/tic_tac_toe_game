import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import Board from "./Board";
import {
  calculateWinner,
  getComputerMove,
  getWinningLine,
  isBoardFull,
} from "./helper/gameLogic";

const EMPTY_BOARD = Array(9).fill(null);
const MODES = [
  { id: "pvp", label: "Vs Friend" },
  { id: "cpu-easy", label: "Vs CPU (Easy)" },
  { id: "cpu-hard", label: "Vs CPU (Hard)" },
];

export default function Game() {
  const [history, setHistory] = useState([EMPTY_BOARD]);
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState("pvp");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const lastResultRef = useRef(null);
  const cpuTimerRef = useRef(null);

  const board = history[currentStep];
  const xIsNext = currentStep % 2 === 0;
  const winner = useMemo(() => calculateWinner(board), [board]);
  const winningLine = useMemo(() => getWinningLine(board), [board]);
  const isDraw = !winner && isBoardFull(board);
  const isAtLatest = currentStep === history.length - 1;
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw"
    : `Next: ${xIsNext ? "X" : "O"}`;

  const handleMove = useCallback(
    (index, player) => {
      if (board[index] || winner || isDraw) return;
      if (currentStep < history.length - 1) {
        lastResultRef.current = null;
      }
      const nextBoard = board.slice();
      nextBoard[index] = player;
      const nextHistory = history.slice(0, currentStep + 1).concat([nextBoard]);
      setHistory(nextHistory);
      setCurrentStep(nextHistory.length - 1);
    },
    [board, winner, isDraw, currentStep, history]
  );

  useEffect(() => {
    if (!isAtLatest) return;
    if (winner && lastResultRef.current !== winner) {
      setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      lastResultRef.current = winner;
    }
    if (isDraw && lastResultRef.current !== "draw") {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      lastResultRef.current = "draw";
    }
  }, [winner, isDraw, isAtLatest]);

  useEffect(() => {
    if (cpuTimerRef.current) {
      clearTimeout(cpuTimerRef.current);
      cpuTimerRef.current = null;
    }

    if (
      mode !== "pvp" &&
      !winner &&
      !isDraw &&
      !xIsNext &&
      isAtLatest
    ) {
      cpuTimerRef.current = setTimeout(() => {
        const move = getComputerMove([...board], mode);
        if (move !== null && board[move] === null) {
          handleMove(move, "O");
        }
      }, 450);
    }

    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    };
  }, [mode, board, xIsNext, winner, isDraw, isAtLatest, handleMove]);

  const handleClick = (index) => {
    if (mode !== "pvp" && !xIsNext) return;
    handleMove(index, xIsNext ? "X" : "O");
  };

  const resetRound = () => {
    setHistory([EMPTY_BOARD]);
    setCurrentStep(0);
    lastResultRef.current = null;
  };

  const resetMatch = () => {
    resetRound();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const handleUndo = () => {
    if (!isAtLatest || currentStep === 0) return;
    let newStep = currentStep - 1;
    if (mode !== "pvp") {
      newStep = currentStep - 2;
    }
    if (newStep < 0) newStep = 0;
    setHistory(history.slice(0, newStep + 1));
    setCurrentStep(newStep);
    lastResultRef.current = null;
  };

  const modeLabel = MODES.find((option) => option.id === mode)?.label;

  return (
    <>
      <GlobalStyle />
      <Root>
        <Backdrop />
        <AppShell>
          <Header>
            <Title>Wemi's Tic-Tac-Toe</Title>
            <Subtitle>Pick a mode, take a turn, and see who wins.</Subtitle>
          </Header>

          <MainGrid>
            <PlayArea>
              <StatusRow>
                <StatusChip $winner={Boolean(winner)} $draw={isDraw}>
                  {status}
                </StatusChip>
                {!isAtLatest && (
                  <ResumeHint>
                    Viewing move {currentStep}. Jump back to keep playing.
                  </ResumeHint>
                )}
              </StatusRow>

              <Board
                squares={board}
                onClick={handleClick}
                winningLine={winningLine}
                disabled={Boolean(winner) || isDraw || (!xIsNext && mode !== "pvp")}
              />

              <ActionRow>
                <PrimaryButton type="button" onClick={resetRound}>
                  New Round
                </PrimaryButton>
                <GhostButton type="button" onClick={handleUndo} disabled={!isAtLatest}>
                  Undo
                </GhostButton>
                <GhostButton type="button" onClick={resetMatch}>
                  Reset Match
                </GhostButton>
              </ActionRow>
            </PlayArea>

            <SidePanel>
              <PanelCard>
                <CardTitle>Scoreboard</CardTitle>
                <ScoreGrid>
                  <ScoreTile>
                    <ScoreLabel>Player X</ScoreLabel>
                    <ScoreValue>{scores.X}</ScoreValue>
                  </ScoreTile>
                  <ScoreTile>
                    <ScoreLabel>Player O</ScoreLabel>
                    <ScoreValue>{scores.O}</ScoreValue>
                  </ScoreTile>
                  <ScoreTile>
                    <ScoreLabel>Draws</ScoreLabel>
                    <ScoreValue>{scores.draws}</ScoreValue>
                  </ScoreTile>
                </ScoreGrid>
              </PanelCard>

              <PanelCard>
                <CardTitle>Mode</CardTitle>
                <ModeRow>
                  {MODES.map((option) => (
                    <ModeButton
                      key={option.id}
                      type="button"
                      $active={mode === option.id}
                      onClick={() => {
                        setMode(option.id);
                        resetRound();
                      }}
                    >
                      {option.label}
                    </ModeButton>
                  ))}
                </ModeRow>
                <ModeNote>Current: {modeLabel}</ModeNote>
              </PanelCard>

              <PanelCard>
                <CardTitle>Move History</CardTitle>
                <HistoryList>
                  {history.map((_, move) => {
                    const isCurrent = move === currentStep;
                    const label = move === 0 ? "Game start" : `Move ${move} (${move % 2 === 1 ? "X" : "O"})`;
                    return (
                      <HistoryButton
                        key={`move-${move}`}
                        type="button"
                        onClick={() => setCurrentStep(move)}
                        $active={isCurrent}
                      >
                        {label}
                      </HistoryButton>
                    );
                  })}
                </HistoryList>
                {!isAtLatest && (
                  <GhostButton type="button" onClick={() => setCurrentStep(history.length - 1)}>
                    Jump to Latest
                  </GhostButton>
                )}
              </PanelCard>
            </SidePanel>
          </MainGrid>
        </AppShell>
      </Root>
    </>
  );
}

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@400;500;600;700&display=swap");

  :root {
    --font-ui: "Space Grotesk", sans-serif;
    --font-display: "DM Serif Display", serif;
    --ink-100: #f8fafc;
    --ink-400: #94a3b8;
    --gold: #fbbf24;
    --ember: #fb7185;
    --ocean: #0ea5e9;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--font-ui);
    background: radial-gradient(circle at top, rgba(14, 116, 144, 0.35), transparent 55%),
      radial-gradient(circle at 20% 20%, rgba(248, 113, 113, 0.25), transparent 45%),
      linear-gradient(120deg, #0f172a 0%, #111827 45%, #0b1120 100%);
    color: var(--ink-100);
    min-height: 100vh;
  }
`;

const Root = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.2), transparent 45%),
    radial-gradient(circle at 15% 70%, rgba(251, 191, 36, 0.16), transparent 40%);
  opacity: 0.9;
  pointer-events: none;
`;

const AppShell = styled.div`
  position: relative;
  z-index: 1;
  padding: clamp(1.5rem, 3vw, 3rem);
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${floatIn} 0.8s ease;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  letter-spacing: 0.02em;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--ink-400);
  font-size: 1.05rem;
  max-width: 560px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PlayArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StatusRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusChip = styled.div`
  align-self: flex-start;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: ${({ $winner, $draw }) =>
    $winner
      ? "linear-gradient(120deg, #fbbf24, #f97316)"
      : $draw
      ? "linear-gradient(120deg, #38bdf8, #0ea5e9)"
      : "linear-gradient(120deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.85))"};
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: ${({ $winner, $draw }) => ($winner || $draw ? "#0f172a" : "#f8fafc")};
  font-weight: 600;
`;

const ResumeHint = styled.span`
  font-size: 0.85rem;
  color: var(--ink-400);
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(120deg, #fbbf24, #f97316);
  color: #0f172a;
  font-weight: 700;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(249, 115, 22, 0.35);
  }
`;

const GhostButton = styled.button`
  background: transparent;
  color: var(--ink-100);
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  transition: border 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(251, 191, 36, 0.6);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SidePanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PanelCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  padding: 1.4rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(8px);
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.1rem;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.9rem;
`;

const ScoreTile = styled.div`
  padding: 0.9rem;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const ScoreLabel = styled.p`
  margin: 0;
  color: var(--ink-400);
  font-size: 0.85rem;
`;

const ScoreValue = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.8rem;
  font-family: var(--font-display);
`;

const ModeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
`;

const ModeButton = styled.button`
  padding: 0.7rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(120deg, rgba(56, 189, 248, 0.85), rgba(14, 165, 233, 0.9))"
      : "rgba(30, 41, 59, 0.6)"};
  color: ${({ $active }) => ($active ? "#0f172a" : "#f8fafc")};
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(56, 189, 248, 0.6);
  }
`;

const ModeNote = styled.p`
  margin: 0.8rem 0 0;
  color: var(--ink-400);
  font-size: 0.9rem;
`;

const HistoryList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.3rem;
`;

const HistoryButton = styled.button`
  text-align: left;
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? "rgba(251, 191, 36, 0.6)" : "rgba(148, 163, 184, 0.2)")};
  background: ${({ $active }) => ($active ? "rgba(251, 191, 36, 0.2)" : "rgba(30, 41, 59, 0.4)")};
  color: var(--ink-100);
  cursor: pointer;
  transition: border 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(251, 191, 36, 0.6);
  }
`;
