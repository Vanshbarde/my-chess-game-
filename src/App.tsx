import { Chess, Square } from 'chess.js';
import { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Activity, Shield, Target, Cpu, Crown, Info, Sword, Castle, User, ChevronUp, RotateCcw, Skull } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Constants ---

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type Color = 'w' | 'b';

// --- Custom Detailed Icons ---

const SoldierIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3z" />
    <path d="M9 7v4l-2 2v6h10v-6l-2-2V7" />
    <path d="M7 21h10" />
    <path d="M10 11h4" />
    <circle cx="12" cy="5" r="0.5" fill="currentColor" />
  </svg>
);

const HorseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 20c0-4.5 3.5-8 8-8h1.5l4.5-4.5 3 2-3 5.5v5H3z" />
    <path d="M11 12l-2-4" />
    <path d="M15 7.5l-2-4" />
    <path d="M17 5.5l-1-2" />
    <circle cx="16" cy="7" r="0.5" fill="currentColor" />
  </svg>
);

const ElephantIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a4 4 0 0 0-4 4v2l-2 2v4l2 2v4h8v-4l2-2v-4l-2-2V7a4 4 0 0 0-4-4z" />
    <path d="M10 11h4" />
    <path d="M12 3v2" />
    <path d="M8 15h8" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
  </svg>
);

const CastleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 21h16" />
    <path d="M5 21V7h2V4h2v3h2V4h2v3h2V4h2v3h2v14" />
    <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
    <path d="M7 11h2" />
    <path d="M15 11h2" />
  </svg>
);

const QueenIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l2 4 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" />
    <circle cx="12" cy="10" r="2" />
    <path d="M8 21h8" />
    <path d="M12 18v3" />
  </svg>
);

const KingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 21h14" />
    <path d="M12 3v4" />
    <path d="M10 5h4" />
    <path d="M7 21V9l5-4 5 4v12" />
    <path d="M10 13h4" />
    <path d="M12 13v4" />
  </svg>
);

const PIECE_ICONS: Record<PieceType, ReactNode> = {
  p: <SoldierIcon className="w-6 h-6" />,
  n: <HorseIcon className="w-6 h-6" />,
  b: <ElephantIcon className="w-6 h-6" />,
  r: <CastleIcon className="w-6 h-6" />,
  q: <QueenIcon className="w-6 h-6" />,
  k: <KingIcon className="w-6 h-6" />,
};

// --- Components ---

const Piece = ({ type, color, isSelected }: { type: PieceType; color: Color; isSelected?: boolean }) => {
  const neonColor = color === 'w' ? 'text-cyber-cyan' : 'text-cyber-orange';
  const glowClass = color === 'w' ? 'drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,140,0,0.8)]';

  return (
    <motion.div
      layoutId={isSelected ? undefined : `piece-${type}-${color}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative flex items-center justify-center w-full h-full transition-all duration-300",
        neonColor,
        glowClass,
        isSelected && "scale-125"
      )}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-current opacity-20 animate-pulse-ring" />
          <div className="w-16 h-16 rounded-full border border-current opacity-10 animate-pulse-ring delay-75" />
        </div>
      )}
      <div className="relative z-10">
        {PIECE_ICONS[type]}
      </div>
    </motion.div>
  );
};

const SquareComponent = ({ 
  square, 
  piece, 
  isDark, 
  isSelected, 
  isLastMove, 
  isValidMove, 
  onClick 
}: any) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-full aspect-square flex items-center justify-center cursor-pointer transition-colors duration-200",
        isDark ? "bg-white/[0.02]" : "bg-white/[0.05]",
        isSelected && "bg-cyber-cyan/20",
        isLastMove && "bg-cyber-pink/10",
        "border border-white/5 hover:border-white/20"
      )}
    >
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 border-[0.5px] border-white/5 pointer-events-none" />
      
      {/* Valid Move Indicator */}
      {isValidMove && (
        <div className={cn(
          "absolute w-3 h-3 rounded-full z-20",
          piece ? "border-2 border-cyber-pink" : "bg-cyber-cyan/40"
        )} />
      )}

      {/* Piece */}
      {piece && (
        <Piece type={piece.type} color={piece.color} isSelected={isSelected} />
      )}

      {/* Square Label (Optional for debug) */}
      <span className="absolute bottom-0.5 right-1 text-[8px] font-mono opacity-10 pointer-events-none">
        {square}
      </span>
    </div>
  );
};

const CaptureEffect = ({ x, y }: any) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute pointer-events-none z-50"
    style={{ left: x, top: y }}
  >
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ 
          x: (Math.random() - 0.5) * 100, 
          y: (Math.random() - 0.5) * 100,
          scale: 0,
          rotate: Math.random() * 360
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute w-2 h-2 bg-cyber-pink shadow-[0_0_10px_#ff00ff]"
      />
    ))}
  </motion.div>
);

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [captures, setCaptures] = useState<{ id: number; x: number; y: number }[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ w: PieceType[]; b: PieceType[] }>({ w: [], b: [] });

  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setMoveHistory([]);
    setLastMove(null);
    setCombo(0);
    setCapturedPieces({ w: [], b: [] });
  };

  const validMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return game.moves({ square: selectedSquare, verbose: true });
  }, [game, selectedSquare]);

  const triggerCapture = (square: Square) => {
    // This is a bit tricky since we don't have the exact pixel coordinates easily
    // We'll estimate based on the board container
    const boardEl = document.getElementById('chess-board');
    if (!boardEl) return;

    const rect = boardEl.getBoundingClientRect();
    const col = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square[1]);
    
    const x = (col + 0.5) * (rect.width / 8);
    const y = (row + 0.5) * (rect.height / 8);

    const id = Date.now();
    setCaptures(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setCaptures(prev => prev.filter(c => c.id !== id));
    }, 600);
  };

  const onSquareClick = (square: Square) => {
    const piece = game.get(square);

    // If a piece is already selected and we click a valid move square
    if (selectedSquare) {
      const move = validMoves.find(m => m.to === square);
      if (move) {
        const targetPiece = game.get(square);
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });

        if (result) {
          if (targetPiece) {
            triggerCapture(square);
            setCapturedPieces(prev => ({
              ...prev,
              [targetPiece.color]: [...prev[targetPiece.color], targetPiece.type]
            }));
          }
          setGame(gameCopy);
          setLastMove({ from: result.from, to: result.to });
          setMoveHistory(prev => [...prev, result.san]);
          setSelectedSquare(null);
          setCombo(prev => prev + 1);
          
          // Simple AI move
          setTimeout(() => {
            const moves = gameCopy.moves({ verbose: true });
            if (moves.length > 0) {
              const randomMove = moves[Math.floor(Math.random() * moves.length)];
              if (randomMove.captured) {
                triggerCapture(randomMove.to);
                setCapturedPieces(prev => ({
                  ...prev,
                  [randomMove.color === 'w' ? 'b' : 'w']: [...prev[randomMove.color === 'w' ? 'b' : 'w'], randomMove.captured as PieceType]
                }));
              }
              gameCopy.move(randomMove);
              setGame(new Chess(gameCopy.fen()));
              const history = gameCopy.history({ verbose: true });
              const last = history[history.length - 1];
              setLastMove({ from: last.from, to: last.to });
            }
          }, 500);
          return;
        }
      }
    }

    // Select piece if it belongs to the current turn
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const board = useMemo(() => {
    const rows = [];
    for (let i = 7; i >= 0; i--) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const square = String.fromCharCode(97 + j) + (i + 1) as Square;
        const piece = game.get(square);
        const isDark = (i + j) % 2 === 0;
        row.push(
          <SquareComponent
            key={square}
            square={square}
            piece={piece}
            isDark={isDark}
            isSelected={selectedSquare === square}
            isLastMove={lastMove?.from === square || lastMove?.to === square}
            isValidMove={validMoves.some(m => m.to === square)}
            onClick={() => onSquareClick(square)}
          />
        );
      }
      rows.push(row);
    }
    return rows;
  }, [game, selectedSquare, validMoves, lastMove]);

  return (
    <div className="relative min-h-screen w-full bg-cyber-bg overflow-x-hidden overflow-y-auto custom-scrollbar">
      {/* Background Effects */}
      <div className="fixed inset-0 data-stream opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8 min-h-screen">
        
        {/* HUD - Left / Top */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-6 w-full lg:w-48 order-2 lg:order-1">
          <div className="glass p-4 rounded-xl border-l-4 border-cyber-cyan flex-1 lg:flex-none">
            <div className="flex items-center gap-2 text-cyber-cyan mb-2">
              <Timer className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Hyper-Clock</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tighter">
              00:42:<span className="text-cyber-cyan">88</span>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border-l-4 border-cyber-pink flex-1 lg:flex-none">
            <div className="flex items-center gap-2 text-cyber-pink mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Combo Streak</span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl sm:text-3xl font-mono font-bold">{combo}</div>
              <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-1.5">
                <motion.div 
                  className="h-full bg-cyber-pink"
                  initial={{ width: 0 }}
                  animate={{ width: `${(combo % 10) * 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Unit Registry - Hidden on very small screens or collapsed */}
          <div className="glass p-4 rounded-xl border-l-4 border-white/20 hidden sm:block lg:block">
            <div className="flex items-center gap-2 text-white/60 mb-3">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Unit Registry</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 opacity-60">
                <SoldierIcon className="w-3 h-3" />
                <span className="text-[8px] font-mono uppercase">Soldier</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <HorseIcon className="w-3 h-3" />
                <span className="text-[8px] font-mono uppercase">Horse</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <ElephantIcon className="w-3 h-3" />
                <span className="text-[8px] font-mono uppercase">Elephant</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <CastleIcon className="w-3 h-3" />
                <span className="text-[8px] font-mono uppercase">Castle</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <QueenIcon className="w-3 h-3" />
                <span className="text-[8px] font-mono uppercase">Queen</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <Crown className="w-3 h-3" />
                <span className="text-[8px] font-mono uppercase">King</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button 
            onClick={resetGame}
            className="glass p-4 rounded-xl border-l-4 border-cyber-cyan flex items-center justify-center gap-3 hover:bg-cyber-cyan/10 transition-colors group flex-1 lg:flex-none"
          >
            <RotateCcw className="w-4 h-4 text-cyber-cyan group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyber-cyan">Reset System</span>
          </button>
        </div>

        {/* Main Game Board Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 15 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ perspective: "1000px" }}
          className="relative z-10 w-full max-w-[min(90vw,600px)] order-1 lg:order-2"
        >
          {/* Board Glow */}
          <div className="absolute -inset-4 bg-cyber-cyan/5 blur-3xl rounded-full pointer-events-none" />
          
          {/* The Board */}
          <div className="relative glass p-1 sm:p-2 rounded-lg border-2 border-white/10 shadow-[0_0_50px_rgba(0,242,255,0.1)]">
            <div id="chess-board" className="grid grid-cols-8 grid-rows-8 w-full aspect-square border border-white/20 relative">
              {board}
              <AnimatePresence>
                {captures.map(c => (
                  <CaptureEffect key={c.id} x={c.x} y={c.y} />
                ))}
              </AnimatePresence>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan" />
          </div>

          {/* Status Indicator */}
          <div className="mt-4 sm:mt-8 flex justify-center">
            <div className={cn(
              "px-4 sm:px-6 py-2 rounded-full border text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500",
              game.turn() === 'w' 
                ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_20px_rgba(0,242,255,0.2)]" 
                : "border-cyber-orange text-cyber-orange bg-cyber-orange/10 shadow-[0_0_20px_rgba(255,140,0,0.2)]"
            )}>
              {game.isGameOver() ? "System Terminated" : `${game.turn() === 'w' ? "Player" : "Core"} Protocol Active`}
            </div>
          </div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {game.isGameOver() && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="glass p-6 sm:p-12 rounded-2xl border-2 border-cyber-pink shadow-[0_0_100px_rgba(255,0,255,0.3)] text-center w-full">
                  <Skull className="w-12 h-12 sm:w-16 sm:h-16 text-cyber-pink mx-auto mb-4 sm:mb-6 animate-pulse" />
                  <h2 className="text-2xl sm:text-4xl font-mono font-bold text-white mb-2 tracking-tighter">MISSION FAILED</h2>
                  <p className="text-cyber-pink font-mono text-xs sm:text-sm uppercase tracking-widest mb-6 sm:mb-8">
                    {game.isCheckmate() ? "Checkmate Detected" : "Stalemate / Draw"}
                  </p>
                  <button 
                    onClick={resetGame}
                    className="w-full sm:w-auto px-8 py-3 bg-cyber-pink text-black font-mono font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
                  >
                    Reboot System
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* HUD - Right / Bottom */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-6 w-full lg:w-64 order-3">
          {/* Captured Pieces */}
          <div className="glass p-4 rounded-xl border-r-4 border-cyber-pink flex-1 lg:flex-none">
            <div className="flex items-center gap-2 text-cyber-pink mb-3">
              <Skull className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Decommissioned</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[8px] font-mono uppercase opacity-40 mb-1">Hostile Units (Black)</div>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.b.map((p, i) => (
                    <div key={i} className="text-cyber-orange opacity-60 scale-75">
                      {PIECE_ICONS[p]}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[8px] font-mono uppercase opacity-40 mb-1">Friendly Units (White)</div>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.w.map((p, i) => (
                    <div key={i} className="text-cyber-cyan opacity-60 scale-75">
                      {PIECE_ICONS[p]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border-r-4 border-cyber-orange flex-1 lg:flex-none h-48 sm:h-auto lg:h-64 flex flex-col">
            <div className="flex items-center gap-2 text-cyber-orange mb-4">
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Data Stream</span>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 custom-scrollbar">
              {moveHistory.map((move, i) => (
                <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                  <span className="opacity-40">[{String(i + 1).padStart(3, '0')}]</span>
                  <span className={i % 2 === 0 ? "text-cyber-cyan" : "text-cyber-orange"}>{move}</span>
                </div>
              ))}
              {moveHistory.length === 0 && <div className="opacity-20 italic">Awaiting first move...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles (Simulated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
