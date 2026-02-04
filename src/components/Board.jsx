import React from "react";
import styled from "styled-components";
import Square from "./Square";

export default function Board({ squares, onClick, winningLine, disabled }) {
  return (
    <BoardContainer>
      {squares.map((square, index) => {
        const isWinning = winningLine ? winningLine.includes(index) : false;
        return (
          <Square
            key={index}
            value={square}
            onClick={() => onClick(index)}
            highlight={isWinning}
            disabled={disabled || Boolean(square)}
            index={index}
          />
        );
      })}
    </BoardContainer>
  );
}

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(4.25rem, 6.5rem));
  gap: 0.85rem;
  justify-content: center;
  padding: 1.2rem;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(16, 24, 40, 0.35), rgba(8, 14, 25, 0.65));
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
`;
