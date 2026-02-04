import React from "react";
import styled from "styled-components";

export default function Square({ value, onClick, highlight, disabled, index }) {
  const label = value ? `Square ${index + 1}, ${value}` : `Square ${index + 1}`;
  return (
    <SquareButton
      type="button"
      onClick={onClick}
      $highlight={highlight}
      disabled={disabled}
      aria-label={label}
    >
      <span>{value}</span>
    </SquareButton>
  );
}

const SquareButton = styled.button`
  height: clamp(4.2rem, 10vw, 6.2rem);
  width: clamp(4.2rem, 10vw, 6.2rem);
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: ${({ $highlight }) =>
    $highlight
      ? "linear-gradient(145deg, rgba(251, 191, 36, 0.95), rgba(249, 115, 22, 0.95))"
      : "linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95))"};
  box-shadow: ${({ $highlight }) =>
    $highlight
      ? "0 16px 30px rgba(249, 115, 22, 0.35)"
      : "0 8px 18px rgba(15, 23, 42, 0.45)"};
  color: ${({ $highlight }) => ($highlight ? "#0f172a" : "#f8fafc")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  font-size: clamp(2.1rem, 6vw, 3.4rem);
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);

  span {
    color: ${({ $highlight }) => ($highlight ? "#0f172a" : "#f8fafc")};
  }

  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-4px)")};
    border-color: rgba(251, 191, 36, 0.6);
  }

  &:focus-visible {
    outline: 2px solid rgba(251, 191, 36, 0.85);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: ${({ $highlight }) => ($highlight ? 1 : 0.7)};
  }
`;
