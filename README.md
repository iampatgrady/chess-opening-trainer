```
 ▗▄▄▖▗▖ ▗▖▗▄▄▄▖ ▗▄▄▖ ▗▄▄▖     ▗▄▖ ▗▄▄▖ ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖    ▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▄▄▖ 
▐▌   ▐▌ ▐▌▐▌   ▐▌   ▐▌       ▐▌ ▐▌▐▌ ▐▌▐▌   ▐▛▚▖▐▌  █  ▐▛▚▖▐▌▐▌         █  ▐▌ ▐▌▐▌ ▐▌  █  ▐▛▚▖▐▌▐▌   ▐▌ ▐▌
▐▌   ▐▛▀▜▌▐▛▀▀▘ ▝▀▚▖ ▝▀▚▖    ▐▌ ▐▌▐▛▀▘ ▐▛▀▀▘▐▌ ▝▜▌  █  ▐▌ ▝▜▌▐▌▝▜▌      █  ▐▛▀▚▖▐▛▀▜▌  █  ▐▌ ▝▜▌▐▛▀▀▘▐▛▀▚▖
▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘▗▄▄▞▘    ▝▚▄▞▘▐▌   ▐▙▄▄▖▐▌  ▐▌▗▄█▄▖▐▌  ▐▌▝▚▄▞▘      █  ▐▌ ▐▌▐▌ ▐▌▗▄█▄▖▐▌  ▐▌▐▙▄▄▖▐▌ ▐▌
                                                                                                          
```



## Purpose

**Chess Opening Trainer** is a specialized tool developed to internalize chess opening variations through active recall. Unlike passive study methods, this application forces the user to execute moves on the board against an engine that responds with specific, pre-programmed lines. This reinforces muscle memory and pattern recognition, simulating the pressure of over-the-board play while providing immediate feedback on theoretical accuracy.

## Core Systems

### 1. Training Architecture
The application splits the opening database into two distinct learning paths:
*   **Book Mode**: Focuses on standard theory—solid, high-percentage lines like the Ruy Lopez, Sicilian Defense, and Queen's Gambit.
*   **Newb Mode**: A curated collection of common sub-1000 ELO traps and blunders (e.g., Wayward Queen, Fried Liver), training the user to identify and punish dubious play efficiently.

### 2. Weighted Selection Logic
The application utilizes a probability-based selection algorithm derived from the user's local performance history. Variations with lower success rates or higher mistake counts are assigned higher weights, ensuring that weaknesses are addressed more frequently than mastered lines within a training cycle.

### 3. State Management & Analytics
*   **Game State**: Leverages `chess.js` for FEN generation, move validation, and game history.
*   **Persistence**: Uses `localStorage` to persist training attempts, calculating metrics such as average move time, success rate per variation, and global completion status without requiring a backend.

## Tech Stack

*   **Frontend**: React 18, TypeScript
*   **Styling**: Tailwind CSS (Utility-first architecture)
*   **Logic**: chess.js (Move validation & generation)
*   **Visualization**: react-chessboard
*   **Icons**: Lucide React

## Installation & Usage

**Prerequisites**
*   Node.js v16+
*   npm or yarn

**Setup**

```bash
# Clone the repository
git clone https://github.com/yourusername/chess-opening-trainer.git

# Install dependencies
npm install

# Start development server
npm start
```

## Directory Structure

```text
/
├── components/       # UI Presentation (Board, History, Stats)
├── data/             # Static database of PGN/FEN strings
├── services/         # Analytics and LocalStorage interaction
├── types.ts          # TypeScript interfaces for Opening/Attempt data
└── App.tsx           # Route/View controller
```

## License

MIT License. Open source for educational and training purposes.