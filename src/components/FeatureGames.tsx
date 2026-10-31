import React, { useState, useEffect, useRef } from 'react';
import contentData from '../data/contentData.json';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Play, 
  Sparkles, 
  Ticket, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Flame
} from 'lucide-react';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: { score: number; voucherCode: string; reward: string; timestamp: string }) => void;
    onFlappyVoucherLose?: (data: { score: number; timestamp: string }) => void;
  }
}

export const FeatureGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake'>('flappy');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Audio tone generator (Web Audio API - polite, synthesized, default muted)
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext may be restricted by autoplay policy
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#004B87] via-[#003B73] to-[#EE3124] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Tính năng 03 · Giải trí tại quầy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Thử Thách Game - Nhận Quà Liền Tay
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-100">
            Chơi mini-game trong lúc chờ phục vụ tại quầy để nhận ngay voucher xăng lên tới 4 lít xăng từ VietinBank Chi nhánh Kiên Giang!
          </p>
        </div>

        {/* Game Mode Switcher Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-4">
          <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl">
            <button
              onClick={() => setSelectedGame('flappy')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedGame === 'flappy'
                  ? 'bg-white text-[#004B87] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Game 1: Flappy Bird (Voucher 2L)
            </button>
            <button
              onClick={() => setSelectedGame('snake')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedGame === 'snake'
                  ? 'bg-white text-[#004B87] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Game 2: Rắn Săn Mồi (Voucher 2L - 4L)
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
            <span>{soundEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}</span>
          </button>
        </div>
      </div>

      {/* Render Active Game */}
      {selectedGame === 'flappy' ? (
        <FlappyBirdGame playBeep={playBeep} />
      ) : (
        <SnakeGame playBeep={playBeep} />
      )}
    </div>
  );
};

/* =========================================================================
   GAME 1: FLAPPY BIRD ("Chờ vui – Chơi hay – Nhận quà liền tay")
   ========================================================================= */

interface FlappyProps {
  playBeep: (freq: number, type?: OscillatorType, duration?: number) => void;
}

const FlappyBirdGame: React.FC<FlappyProps> = ({ playBeep }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game Configuration Parameters (Easily modifiable as requested)
  const WIN_SCORE = 20;
  const GRAVITY = 0.28;
  const JUMP_FORCE = -5.8;
  const PIPE_SPEED = 2.1;
  const PIPE_GAP = 145; // Generous comfortable gap for counter visitors
  const VOUCHER_TEXT = 'Voucher 2 lít xăng';
  const BRAND_NAME = 'VietinBank';
  const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

  // Game States
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN' | 'LOSE'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [recentVoucher, setRecentVoucher] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [encouragement, setEncouragement] = useState('Khởi động nhẹ nhàng!');

  // Animation Loop ref
  const reqIdRef = useRef<number | null>(null);

  // Physics state
  const birdRef = useRef({
    x: 70,
    y: 180,
    vy: 0,
    radius: 14,
    rotation: 0
  });

  const pipesRef = useRef<Array<{ x: number; top: number; bottom: number; passed: boolean }>>([]);

  // Load persisted data
  useEffect(() => {
    const savedHigh = localStorage.getItem('vb_flappy_high_score');
    if (savedHigh) setHighScore(parseInt(savedHigh, 10));

    const savedVoucher = localStorage.getItem('vb_flappy_latest_voucher');
    if (savedVoucher) setRecentVoucher(savedVoucher);
  }, []);

  const generateVoucherCode = () => {
    const randNum = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randNum}`;
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateEncouragement = (s: number) => {
    if (s < 5) setEncouragement('Khởi động nhẹ nhàng!');
    else if (s < 10) setEncouragement('Tốt lắm, tiếp tục nào!');
    else if (s < 15) setEncouragement('Một nửa chặng đường rồi!');
    else if (s < 20) setEncouragement('Sắp nhận quà rồi!');
    else setEncouragement('Xuất sắc!');
  };

  const jump = () => {
    if (gameState === 'START') {
      startGame();
      return;
    }
    if (gameState === 'PLAYING') {
      birdRef.current.vy = JUMP_FORCE;
      playBeep(440, 'triangle', 0.08);
    }
  };

  const startGame = () => {
    birdRef.current = { x: 70, y: 180, vy: 0, radius: 14, rotation: 0 };
    pipesRef.current = [];
    setScore(0);
    updateEncouragement(0);
    setGameState('PLAYING');
  };

  const resetGame = () => {
    startGame();
  };

  const winGame = () => {
    setGameState('WIN');
    const newCode = generateVoucherCode();
    setVoucherCode(newCode);
    setRecentVoucher(newCode);
    localStorage.setItem('vb_flappy_latest_voucher', newCode);

    setHighScore((prev) => {
      const next = Math.max(prev, WIN_SCORE);
      localStorage.setItem('vb_flappy_high_score', next.toString());
      return next;
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    playBeep(587.33, 'sine', 0.2);
    setTimeout(() => playBeep(880, 'sine', 0.4), 200);

    if (window.onFlappyVoucherWin) {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  };

  const endGame = () => {
    setGameState('LOSE');
    playBeep(180, 'sawtooth', 0.25);

    setHighScore((prev) => {
      const next = Math.max(prev, score);
      localStorage.setItem('vb_flappy_high_score', next.toString());
      return next;
    });

    if (window.onFlappyVoucherLose) {
      window.onFlappyVoucherLose({
        score,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // Clear & Draw background (VietinBank subtle sky & cloud layers)
      ctx.fillStyle = '#E0F2FE';
      ctx.fillRect(0, 0, width, height);

      // Distant clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80 + (frameCount * 0.3) % (width + 100), 50, 30, 0, Math.PI * 2);
      ctx.arc(110 + (frameCount * 0.3) % (width + 100), 45, 40, 0, Math.PI * 2);
      ctx.arc(140 + (frameCount * 0.3) % (width + 100), 50, 30, 0, Math.PI * 2);
      ctx.fill();

      // Ground strip
      ctx.fillStyle = '#004B87';
      ctx.fillRect(0, height - 20, width, 20);
      ctx.fillStyle = '#EE3124';
      ctx.fillRect(0, height - 24, width, 4);

      if (gameState === 'PLAYING') {
        // Physics update
        const bird = birdRef.current;
        bird.vy += GRAVITY;
        bird.y += bird.vy;
        bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.vy * 0.08));

        // Generate pipes
        if (frameCount % 90 === 0) {
          const minPipe = 40;
          const maxPipe = height - PIPE_GAP - minPipe - 24;
          const topH = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          pipesRef.current.push({
            x: width,
            top: topH,
            bottom: height - 24 - (topH + PIPE_GAP),
            passed: false
          });
        }

        // Move pipes & collision check
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          const pipeWidth = 50;

          // Check pass for point
          if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            setScore((prev) => {
              const newScore = prev + 1;
              updateEncouragement(newScore);
              playBeep(600, 'sine', 0.1);
              if (newScore >= WIN_SCORE) {
                winGame();
              }
              return newScore;
            });
          }

          // Collision with pipe
          const birdBox = {
            left: bird.x - bird.radius + 2,
            right: bird.x + bird.radius - 2,
            top: bird.y - bird.radius + 2,
            bottom: bird.y + bird.radius - 2
          };

          const inPipeHoriz = birdBox.right > pipe.x && birdBox.left < pipe.x + pipeWidth;
          const hitTopPipe = birdBox.top < pipe.top;
          const hitBottomPipe = birdBox.bottom > height - 24 - pipe.bottom;

          if (inPipeHoriz && (hitTopPipe || hitBottomPipe)) {
            endGame();
            return;
          }

          // Remove offscreen pipes
          if (pipe.x + pipeWidth < -10) {
            pipesRef.current.splice(i, 1);
          }
        }

        // Ground / ceiling collision
        if (bird.y + bird.radius >= height - 24 || bird.y - bird.radius <= 0) {
          endGame();
          return;
        }
      }

      // Draw Pipes
      pipesRef.current.forEach((pipe) => {
        const pipeWidth = 50;
        // Top pipe
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillStyle = '#0369A1';
        ctx.fillRect(pipe.x - 3, pipe.top - 16, pipeWidth + 6, 16);

        // Bottom pipe
        const bottomY = height - 24 - pipe.bottom;
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(pipe.x, bottomY, pipeWidth, pipe.bottom);
        ctx.fillStyle = '#0369A1';
        ctx.fillRect(pipe.x - 3, bottomY, pipeWidth + 6, 16);
      });

      // Draw Flying Character (VietinBank mascot credit card / bird)
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.rotation);

      // Card / Bird body
      ctx.fillStyle = '#004B87';
      ctx.beginPath();
      ctx.roundRect(-16, -11, 32, 22, 5);
      ctx.fill();

      // Red stripe
      ctx.fillStyle = '#EE3124';
      ctx.fillRect(-16, 2, 32, 4);

      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(8, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(9, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(-6, 0, 8, 4, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      reqIdRef.current = requestAnimationFrame(render);
    };

    reqIdRef.current = requestAnimationFrame(render);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [gameState]);

  return (
    <div id="flappy-voucher-game" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Title & Stats HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{GAME_TITLE}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mục tiêu: Đạt {WIN_SCORE} điểm nhận {VOUCHER_TEXT} của {BRAND_NAME}
          </p>
        </div>

        {/* Dynamic Encouragement & Score */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{encouragement}</span>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-semibold">Điểm số</div>
            <div className="text-xl font-black text-[#004B87] tabular-nums">
              {score} / {WIN_SCORE}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar from 0 to 20 */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1.5">
          <span>Tiến độ nhận quà</span>
          <span>{Math.round((score / WIN_SCORE) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-[#004B87] to-[#EE3124] rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Canvas Playfield Container */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-slate-300 shadow-inner bg-sky-50 touch-game-safe">
        <canvas
          ref={canvasRef}
          width={480}
          height={340}
          onClick={jump}
          className="w-full h-auto block cursor-pointer select-none"
        />

        {/* Start Overlay Screen */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EE3124] flex items-center justify-center shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-black">Chờ vui – Chơi hay – Nhận quà liền tay</h4>
              <p className="text-xs text-slate-200 mt-1 max-w-xs">
                Vượt qua 20 thử thách để nhận voucher 2 lít xăng tại quầy giao dịch
              </p>
            </div>
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#EE3124] hover:bg-[#d61b1b] text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
            <p className="text-xs text-slate-300">
              💡 Chạm màn hình, click chuột hoặc nhấn <kbd className="px-1.5 py-0.5 bg-black/40 rounded text-[10px]">Space</kbd> để bay
            </p>
          </div>
        )}

        {/* Win Overlay Screen */}
        {gameState === 'WIN' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-amber-300">Chúc mừng!</h4>
              <p className="text-xs text-slate-200 mt-1 max-w-xs">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận voucher 2 lít xăng.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-white/10 border-2 border-dashed border-amber-400/80 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-amber-300">Mã nhận quà VietinBank</div>
                <div className="text-xl font-mono font-black text-white tracking-widest">{voucherCode}</div>
              </div>
              <button
                onClick={() => copyVoucherCode(voucherCode)}
                className="p-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                title="Sao chép mã"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed">
              Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
            </p>

            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại</span>
            </button>
          </div>
        )}

        {/* Lose Overlay Screen */}
        {gameState === 'LOSE' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-fadeIn">
            <div className="text-3xl">🎯</div>
            <div>
              <h4 className="text-xl font-black">Rất tiếc!</h4>
              <p className="text-xs text-slate-200 mt-1">
                Bạn đã vượt qua <span className="font-bold text-amber-300">{score}/{WIN_SCORE}</span> thử thách
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EE3124] hover:bg-[#d61b1b] text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={() => setGameState('START')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <span>Về màn hình chính</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Recent Voucher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Điểm cao nhất: <strong className="text-slate-900">{highScore}</strong></span>
        </div>

        {recentVoucher && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
            <Ticket className="w-3.5 h-3.5 text-amber-600" />
            <span>Mã gần nhất: <strong className="font-mono font-bold">{recentVoucher}</strong></span>
          </div>
        )}
      </div>

    </div>
  );
};

/* =========================================================================
   GAME 2: RẮN SĂN MỒI ("VietinBank Snake Challenge")
   ========================================================================= */

interface SnakeProps {
  playBeep: (freq: number, type?: OscillatorType, duration?: number) => void;
}

const SnakeGame: React.FC<SnakeProps> = ({ playBeep }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Milestone config
  const MILESTONE_1 = 20; // 1 voucher 2L
  const MILESTONE_2 = 40; // 2 vouchers 2L

  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'OVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [currentReward, setCurrentReward] = useState<string>('Chưa đạt mốc thưởng');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [giftCertificate, setGiftCertificate] = useState<{
    score: number;
    rewardText: string;
    voucherCode: string;
    timestamp: string;
  } | null>(null);

  // Snake coordinates
  const GRID_SIZE = 16;
  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const timerRef = useRef<number | null>(null);
  const reached20Ref = useRef(false);
  const reached40Ref = useRef(false);

  const spawnFood = () => {
    foodRef.current = {
      x: Math.floor(Math.random() * 24),
      y: Math.floor(Math.random() * 18)
    };
  };

  const showMilestoneToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    dirRef.current = { x: 1, y: 0 };
    spawnFood();
    setScore(0);
    setCurrentReward('Chưa đạt mốc thưởng');
    reached20Ref.current = false;
    reached40Ref.current = false;
    setGiftCertificate(null);
    setGameState('PLAYING');
  };

  const handleGameOver = () => {
    setGameState('OVER');
    playBeep(200, 'sawtooth', 0.3);

    const currentScore = score;
    let rewardText = '';
    let hasVoucher = false;

    if (currentScore >= MILESTONE_2) {
      rewardText = '02 voucher xăng (mỗi voucher 2 lít)';
      hasVoucher = true;
    } else if (currentScore >= MILESTONE_1) {
      rewardText = '01 voucher xăng trị giá 2 lít';
      hasVoucher = true;
    } else {
      rewardText = 'Chưa đạt mốc nhận voucher (cần tối thiểu 20 điểm)';
    }

    const code = hasVoucher
      ? `VB-SNAKE-${Math.floor(100000 + Math.random() * 900000)}`
      : 'CHƯA_ĐẠT_MỐC';

    setGiftCertificate({
      score: currentScore,
      rewardText,
      voucherCode: code,
      timestamp: new Date().toLocaleString('vi-VN')
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      const { x, y } = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && y !== 1) {
        dirRef.current = { x: 0, y: -1 };
        e.preventDefault();
      } else if ((e.key === 'ArrowDown' || e.key === 's') && y !== -1) {
        dirRef.current = { x: 0, y: 1 };
        e.preventDefault();
      } else if ((e.key === 'ArrowLeft' || e.key === 'a') && x !== 1) {
        dirRef.current = { x: -1, y: 0 };
        e.preventDefault();
      } else if ((e.key === 'ArrowRight' || e.key === 'd') && x !== -1) {
        dirRef.current = { x: 1, y: 0 };
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Game Loop Timer (Moderate relaxed banking speed ~130ms)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    timerRef.current = window.setInterval(() => {
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      head.x += dirRef.current.x;
      head.y += dirRef.current.y;

      // Wall collision (24 cols x 18 rows)
      if (head.x < 0 || head.x >= 24 || head.y < 0 || head.y >= 18) {
        handleGameOver();
        return;
      }

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          handleGameOver();
          return;
        }
      }

      snake.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const nextScore = score + 1;
        setScore(nextScore);
        playBeep(520, 'triangle', 0.08);

        // Milestone rewards
        if (nextScore >= MILESTONE_2 && !reached40Ref.current) {
          reached40Ref.current = true;
          setCurrentReward('02 Voucher 2L xăng');
          showMilestoneToast('Xuất sắc! Đạt mốc 40 điểm - Nhận 02 voucher xăng (2L x 2)');
          confetti({ particleCount: 60, spread: 60 });
        } else if (nextScore >= MILESTONE_1 && !reached20Ref.current) {
          reached20Ref.current = true;
          setCurrentReward('01 Voucher 2L xăng');
          showMilestoneToast('Chúc mừng! Đạt mốc 20 điểm - Nhận 01 voucher xăng 2L');
          confetti({ particleCount: 40, spread: 50 });
        }

        spawnFood();
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      drawCanvas();
    }, 130);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, score]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = 24;
    const rows = 18;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    // Background grid
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle bank grid dots
    ctx.fillStyle = '#1E293B';
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if ((c + r) % 2 === 0) {
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }

    // Draw Food (Golden Coin / Star)
    const food = foodRef.current;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * cellW, (food.y + 0.5) * cellH, cellW * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Snake
    const snake = snakeRef.current;
    snake.forEach((part, index) => {
      if (index === 0) {
        ctx.fillStyle = '#EE3124'; // Head red
      } else {
        ctx.fillStyle = index % 2 === 0 ? '#0284C7' : '#004B87'; // Body blue VietinBank
      }
      ctx.beginPath();
      ctx.roundRect(
        part.x * cellW + 1,
        part.y * cellH + 1,
        cellW - 2,
        cellH - 2,
        index === 0 ? 4 : 2
      );
      ctx.fill();
    });
  };

  // Touch pad for mobile
  const setDir = (newDir: { x: number; y: number }) => {
    if (gameState !== 'PLAYING') return;
    const { x, y } = dirRef.current;
    if (newDir.x !== 0 && x === 0) dirRef.current = newDir;
    if (newDir.y !== 0 && y === 0) dirRef.current = newDir;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            VietinBank Snake Challenge
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chơi vui tại quầy – Săn voucher xăng hấp dẫn
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-bold text-[#004B87]">
            Thưởng: {currentReward}
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Điểm số</span>
            <span className="text-2xl font-black text-[#EE3124] tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <span className="block font-bold text-slate-800">Mốc 20 điểm</span>
          <span className="text-emerald-600 font-semibold">01 voucher 2L</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <span className="block font-bold text-slate-800">Mốc 40 điểm</span>
          <span className="text-amber-600 font-semibold">02 voucher 2L</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <span className="block font-bold text-slate-800">Phím di chuyển</span>
          <span className="text-slate-600">Phím mũi tên / D-Pad</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <span className="block font-bold text-slate-800">Ăn vật phẩm</span>
          <span className="text-blue-600 font-semibold">+1 điểm / lượt</span>
        </div>
      </div>

      {/* Playfield with Overlay */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-slate-700 shadow-xl bg-slate-950 touch-game-safe">
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="w-full h-auto block select-none"
        />

        {/* Milestone floating toast */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg border border-amber-300 animate-bounce">
            🎉 {toastMessage}
          </div>
        )}

        {/* Initial Idle Screen */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
            <h4 className="text-2xl font-black text-white">VietinBank Snake Challenge</h4>
            <p className="text-xs text-slate-300 max-w-xs">
              Điều khiển rắn thu thập tiền vàng. Đạt từ 20 điểm trở lên để nhận phiếu quà tặng xăng tại quầy!
            </p>
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#EE3124] hover:bg-[#d61b1b] text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'OVER' && giftCertificate && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-white text-center space-y-3 overflow-y-auto">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
              {giftCertificate.score >= MILESTONE_1 ? '🎉' : '🎯'}
            </div>

            {/* Official Voucher Slip */}
            <div className="bg-white text-slate-900 rounded-xl p-4 w-full max-w-xs text-left shadow-2xl border border-slate-300 space-y-2">
              <div className="border-b border-dashed border-slate-300 pb-2 flex justify-between items-center">
                <span className="text-[11px] font-black uppercase text-[#004B87]">PHIẾU XÁC NHẬN QUÀ TẶNG</span>
                <span className="text-[10px] text-slate-500">VietinBank</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm cuối cùng:</span>
                  <span className="font-bold text-base text-[#004B87]">{giftCertificate.score} điểm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mức quà:</span>
                  <span className="font-bold text-[#EE3124]">{giftCertificate.rewardText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian:</span>
                  <span className="text-slate-600">{giftCertificate.timestamp}</span>
                </div>
                {giftCertificate.voucherCode !== 'CHƯA_ĐẠT_MỐC' && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Mã voucher:</span>
                    <span className="font-mono font-black text-sm text-slate-900 bg-amber-100 px-2 py-0.5 rounded">
                      {giftCertificate.voucherCode}
                    </span>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500 leading-snug italic text-center">
                Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
              </div>
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EE3124] hover:bg-[#d61b1b] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen Mobile D-Pad Control Pad */}
      <div className="sm:hidden flex flex-col items-center gap-1.5 pt-2">
        <button
          onClick={() => setDir({ x: 0, y: -1 })}
          className="w-14 h-12 bg-slate-100 active:bg-slate-300 rounded-xl flex items-center justify-center font-bold text-slate-800 shadow-xs"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setDir({ x: -1, y: 0 })}
            className="w-14 h-12 bg-slate-100 active:bg-slate-300 rounded-xl flex items-center justify-center font-bold text-slate-800 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDir({ x: 0, y: 1 })}
            className="w-14 h-12 bg-slate-100 active:bg-slate-300 rounded-xl flex items-center justify-center font-bold text-slate-800 shadow-xs"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDir({ x: 1, y: 0 })}
            className="w-14 h-12 bg-slate-100 active:bg-slate-300 rounded-xl flex items-center justify-center font-bold text-slate-800 shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
