import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Board from "./Board";

import { applyCalculateWiner } from "./helper/applyCalculateWinner";
import { Button } from "antd";

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null)); //setting the board to an array of 9
  const [xIsNext, setXisNext] = useState(true);
  const winner = applyCalculateWiner(board);

  const handleClick = (i) => {
    const updatedBoard = [...board];
    // If user clicks an occupied square or if game is won, return
    if (winner || updatedBoard[i]) return;
    // Put an X or an O in the clicked square
    updatedBoard[i] = xIsNext ? "X" : "O";
    setBoard(updatedBoard);
    setXisNext(!xIsNext);
  };

  //once a player wins and game is over
  const renderRestartButton = () => (
    <ButtonStyling onClick={() => setBoard(Array(9).fill(null))}>
      Restart Game
    </ButtonStyling>
  );

  return (
    <>
      <GlobalStyle backgroundColor />
      <RootContainer>
        <GameContainer>
          <TitleContainer>Wemi's Tic-Tac-Toe</TitleContainer>
          <GameInfo>
            {winner
              ? `The Winner is ${winner} 🎉`
              : `Next Player is: ${xIsNext ? "X" : "O"}`}
          </GameInfo>
          <Board squares={board} onClick={handleClick} />
          <ResetButtonContainer>{renderRestartButton()}</ResetButtonContainer>
        </GameContainer>
      </RootContainer>
    </>
  );
}

//styled componenents
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) =>
      props.backgroundColor ? "#334257" : "black"};
  }
  `;

const RootContainer = styled.div`
  font-family: "museo", Century Gothic, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
`;

const GameContainer = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameInfo = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  color: #f94c66;
  background-color: #e9dac1;
  width: 20rem;
  font-size: 1.5rem;
  margin: auto 0.5rem 1.5rem;
  box-shadow: 0px 0px 8px #888;
  border-radius: 0.5rem;
  font-weight: bold;
`;

const ResetButtonContainer = styled.div``;

const ButtonStyling = styled(Button)`
  background-color: #002B5B;
  color: #fffde7;
  border-radius: 4px;
  border: none;
  font-size: 24px;
  line-height: 48px;
  height: 48px;
  margin-top: 20px;

  &:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  }

  &:focus {
    outline: none;
  }
`;

const TitleContainer = styled.h1`
  color: #f94c66;
`;
