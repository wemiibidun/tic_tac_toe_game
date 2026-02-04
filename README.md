![GitHub code size](https://img.shields.io/github/languages/code-size/wemiibidun/tic_tac_toe_game)
![GitHub language count](https://img.shields.io/github/languages/count/wemiibidun/tic_tac_toe_game)

# Wemi Tic Tac Toe
A clean, modern Tic Tac Toe game built with React and styled-components. It supports Friend mode and CPU mode (Easy + Hard), includes a scoreboard, move history, and clean game logic.

## Table of contents
- [What I built](#what-i-built)
- [How it works](#how-it-works)
- [Features](#features)
- [Tech stack](#tech-stack)
- [How to run](#how-to-run)
- [Screenshot](#screenshot)
- [Status](#status)
- [Inspiration](#inspiration)
- [Contact](#contact)

## What I built
I built a full Tic Tac Toe experience that feels polished and easy to use. The project includes:
- A fresh UI redesign with custom styling and animation
- Multiple play modes (friend vs friend, CPU easy, CPU hard)
- Score tracking across rounds
- Move history with jump-to-step
- Win highlighting + draw detection

## How it works
The game state is handled with React hooks and a simple game engine:
- The board is stored as an array of 9 slots (`null`, `X`, `O`).
- Each move creates a new board state and is stored in `history` so you can jump back in time.
- The winner is calculated by checking all possible win lines.
- The CPU uses:
  - Easy mode: random move from available squares
  - Hard mode: a minimax algorithm to choose the best move
- The scoreboard updates when a round finishes.

## Features
- Friend mode and CPU mode
- Easy + Hard CPU difficulty
- Undo, new round, reset match
- Scoreboard (X, O, Draws)
- Move history with jump-to-step
- Win highlight + draw detection

## Tech stack
- React
- JavaScript
- styled-components

## How to run
```bash
npm install
npm start
```
Open http://localhost:3000 in your browser.

## Screenshot
![Sample image](https://github.com/wemiibidun/tic_tac_toe_game/blob/main/Screen%20Shot.png)

## Status
Project is: Active

## Inspiration
Inspired by the official React Tic Tac Toe tutorial.

## Contact
Created by [@wemiibidun](https://twitter.com/wemiibidun/). Feel free to contact me via wemiibidun@gmail.com
