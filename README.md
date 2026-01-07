# Chess Opening Trainer

A modern, responsive React application designed to help players memorize chess openings and learn how to punish common beginner mistakes.

![Chess Opening Trainer](https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1000)

## 🎯 Overview

Mastering chess openings requires repetition and understanding. This application provides an interactive environment where users must replicate specific variation moves to advance. It features two distinct modes:

1.  **Book Mode**: Practice standard theoretical lines like the Ruy Lopez, Italian Game, and Sicilian Defense.
2.  **Newb Mode (500 Elo Simulation)**: Learn to identify and punish common blunders and dubious traps often seen at the beginner level (e.g., Wayward Queen Attack).

## ✨ Features

*   **Interactive Chessboard**: Smooth drag-and-drop or click-to-move interface powered by `react-chessboard`.
*   **Real-time Validation**: Instant feedback on whether your move matches the target variation.
*   **Smart Move Assistance**:
    *   **Hint System**: Highlights the start and end squares for the correct move.
    *   **Auto-Play**: The "opponent" automatically plays their response.
    *   **Undo/Retry**: Easily step back through the move history.
*   **Dual Modes**: Toggle between studying serious theory (`Book Mode`) and tactical refutations (`Newb Mode`).
*   **Strategic Context**: Displays key strategic themes and explanations for every opening.
*   **Responsive Design**: Fully optimized for both desktop and mobile devices using Tailwind CSS.
*   **Celebration Effects**: Confetti animations upon successfully completing a variation.

## 🛠️ Tech Stack

*   **Framework**: React 18 with TypeScript
*   **Styling**: Tailwind CSS
*   **Chess Logic**: `chess.js` (Move validation, FEN generation)
*   **Board UI**: `react-chessboard`
*   **Icons**: `lucide-react`
*   **Effects**: `canvas-confetti`
*   **Build Tool**: Vite (implied structure)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/chess-opening-trainer.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd chess-opening-trainer
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎮 How to Play

1.  **Select a Mode**: Use the toggle in the top-right corner of the header.
    *   **Blue Book Icon**: Standard Opening Theory.
    *   **Red Skull Icon**: Trap/Blunder Refutation.
2.  **Make a Move**: 
    *   If you are White, make the first move.
    *   If you are Black, the computer will move first.
    *   Drag a piece or click source/target squares to move.
3.  **Feedback**:
    *   **Correct**: The game continues, and the opponent responds automatically.
    *   **Incorrect**: The board shakes (visual feedback) or an error message appears. You must play the specific move defined in the variation.
4.  **Completion**: Finish the line to trigger the success animation and automatically load the next opening.

## 📂 Project Structure

```
├── components/
│   ├── ModeToggle.tsx      # Switch between Book/Newb modes
│   ├── MoveHistory.tsx     # Displays list of moves played (PGN style)
│   ├── OpeningTrainer.tsx  # Main game logic, board wrapper, and controls
│   └── StatsPanel.tsx      # Displays themes and description
├── data/
│   └── openings.ts         # Database of opening variations
├── types.ts                # TypeScript interfaces
├── App.tsx                 # Main layout and state management
└── index.tsx               # Entry point
```

## 🛡️ License

This project is open-source and available under the MIT License.
