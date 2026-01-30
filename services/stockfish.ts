import { Move } from 'chess.js';

type Evaluation = {
  type: 'cp' | 'mate';
  value: number;
};

type EngineMessage = {
  bestMove?: string;
  evaluation?: Evaluation;
  possibleMoves?: Array<{ san: string; score: number; uci: string }>;
};

class StockfishService {
  private worker: Worker | null = null;
  private isReady = false;

  constructor() {
    // We load stockfish from a CDN to avoid local binary management
    const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.js';
    
    // We check if we are in a browser environment
    if (typeof window !== 'undefined') {
        fetch(stockfishUrl)
        .then(response => response.text())
        .then(script => {
            const blob = new Blob([script], { type: 'application/javascript' });
            this.worker = new Worker(window.URL.createObjectURL(blob));
            this.initWorker();
        });
    }
  }

  private initWorker() {
    if (!this.worker) return;
    this.worker.onmessage = (e) => {
      if (e.data === 'uciok') this.isReady = true;
    };
    this.worker.postMessage('uci');
    this.worker.postMessage('isready');
  }

  async getEvaluation(fen: string, multiPv: number = 5): Promise<EngineMessage> {
    return new Promise((resolve) => {
      if (!this.worker) return resolve({});

      const moves: Array<{ san: string; score: number; uci: string }> = [];
      let bestMoveEvaluation: Evaluation = { type: 'cp', value: 0 };
      
      const handler = (e: MessageEvent) => {
        const line = e.data;
        
        // Parse info lines for score and pv
        if (typeof line === 'string' && line.startsWith('info') && line.includes('pv')) {
           // Check for Mate
           const mateMatch = line.match(/score mate (-?\d+)/);
           // Check for CP
           const cpMatch = line.match(/score cp (-?\d+)/);
           
           const pvMatch = line.match(/ pv (.*?)$/);
           const multipvMatch = line.match(/multipv (\d+)/);
           
           if (pvMatch && multipvMatch) {
             let score = 0;
             let evalType: 'cp' | 'mate' = 'cp';

             if (mateMatch) {
                score = parseInt(mateMatch[1]);
                evalType = 'mate';
             } else if (cpMatch) {
                score = parseInt(cpMatch[1]);
             }

             const uci = pvMatch[1].split(' ')[0];
             const idx = parseInt(multipvMatch[1]) - 1;
             
             // Index 0 is the best move
             if (idx === 0) {
                 bestMoveEvaluation = { type: evalType, value: score };
             }

             moves[idx] = { san: '', score, uci }; 
           }
        }

        if (typeof line === 'string' && line.startsWith('bestmove')) {
          const parts = line.split(' ');
          const bestMove = parts[1];
          this.worker?.removeEventListener('message', handler);
          resolve({
            bestMove,
            evaluation: bestMoveEvaluation,
            possibleMoves: moves.filter(m => m)
          });
        }
      };

      this.worker.addEventListener('message', handler);
      
      this.worker.postMessage('stop');
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`setoption name MultiPV value ${multiPv}`);
      this.worker.postMessage('go depth 12');
    });
  }
}

export const stockfish = new StockfishService();
