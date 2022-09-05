import React from "react";
import styled from "styled-components";
import { Button } from "antd";

export default function Square(props) {
  return (
    <>
      <SquareButtonContainer onClick={props.onClick}>
        {props.value}
      </SquareButtonContainer>
    </>
  );
}

//styled componenents
const SquareButtonContainer = styled(Button)`
  background-color: #e9dac1;
  border: none;
  border-radius: 10%;
  box-shadow: 0 0 8px #18978f;
  text-align: center;
  height: 5rem;
  width: 5rem;
  font-size: 50px;
  font-family: "Helvetica", sans-serif;
  font-weight: bold;
  line-height: 5rem;
  margin: 0.5rem;
  color: ${(props) => (props.value ? "#B22727" : "#006E7F")};
  &:hover {
    box-shadow: 0 0 15px #f7ec09;
  }
`;
