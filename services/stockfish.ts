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
  private analysisListener: ((e: MessageEvent) => void) | null = null;

  constructor() {
    // Using Stockfish 10 via CDN for stability. 
    // While SF 17 is newer, SF 10 at depth 15+ is >3200 ELO (Super GM level) and sufficient for training.
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
    // Align with requested settings: 3 lines
    this.worker.postMessage('setoption name MultiPV value 3');
  }

  // Used for one-shot calculations (AI moves, player move validation)
  // We use depth 15 for speed/accuracy balance during gameplay (approx 1-2s)
  async getEvaluation(fen: string, multiPv: number = 3): Promise<EngineMessage> {
    // Stop any running continuous analysis to prevent conflict
    this.stopAnalysis();

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
      // Depth 15 is a good balance for validation. 
      // User asked for "Max 10s", but for gameplay validation, 10s is too long. 
      // We use depth which finishes faster but is accurate.
      this.worker.postMessage('go depth 15');
    });
  }

  // Used for the UI Evaluation Bar (Continuous streaming)
  // This uses the requested "Maximum time 10 sec" setting to give high quality bar analysis.
  startAnalysis(fen: string, onUpdate: (evalData: Evaluation) => void) {
    if (!this.worker) return;
    
    // Clear previous listener if exists
    this.stopAnalysis();

    this.analysisListener = (e: MessageEvent) => {
        const line = e.data;
        if (typeof line === 'string' && line.startsWith('info') && !line.includes('currmove')) {
            // We only care about the best move (MultiPV 1 logic for the bar value)
            const multipvMatch = line.match(/multipv (\d+)/);
            
            // If MultiPV is set to 3 globally, we only want to update the bar with the *best* line (multipv 1)
            // otherwise the bar might flicker with lower scores from 2nd/3rd best moves.
            if (multipvMatch && multipvMatch[1] !== '1') {
                return; 
            }

            const mateMatch = line.match(/score mate (-?\d+)/);
            const cpMatch = line.match(/score cp (-?\d+)/);
            
            // Only update if we have a score
            if (mateMatch || cpMatch) {
                if (mateMatch) {
                    onUpdate({ type: 'mate', value: parseInt(mateMatch[1]) });
                } else if (cpMatch) {
                    onUpdate({ type: 'cp', value: parseInt(cpMatch[1]) });
                }
            }
        }
    };

    this.worker.addEventListener('message', this.analysisListener);
    
    this.worker.postMessage('stop');
    this.worker.postMessage(`position fen ${fen}`);
    // For the eval bar, we want the single best score, but accurate.
    this.worker.postMessage('setoption name MultiPV value 1'); 
    // Run for 10 seconds (10000ms) as requested for high accuracy
    this.worker.postMessage('go movetime 10000'); 
  }

  stopAnalysis() {
    if (this.worker && this.analysisListener) {
        this.worker.removeEventListener('message', this.analysisListener);
        this.analysisListener = null;
        this.worker.postMessage('stop');
    }
  }
}

export const stockfish = new StockfishService();
