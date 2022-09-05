import React from "react";
import styled from "styled-components";
import Square from "./Square";

export default function Board({ squares, onClick }) {
  return (
    <>
      <BoardContainer>
        {/* iterate through the list of squares */}
        {squares.map((square, index) => {
          // value will be the value you get from your list
          //pass onclick function and run on index that is being run
          return (
            <Square key={index} value={square} onClick={() => onClick(index)} />
          );
        })}
      </BoardContainer>
    </>
  );
}

//styled componenents
const BoardContainer = styled.div`
  display: grid;
  //   repeat the column 3 times with 6rem apart
  grid-template-columns: repeat(3, 8rem);
  place-items: center;
  justify-content: center;
  background-color: #54bab9;
  padding: 30px 25px 20px;
`;
