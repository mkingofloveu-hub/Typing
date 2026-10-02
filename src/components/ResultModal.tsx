import React, { useEffect, useRef } from 'react';
import { GameScoreRecord, RunnerCharacter } from '../types';
import { calculateGrade, getRankTitleKm, getRankTitleEn } from '../utils/khmerUnicode';
import { RotateCcw, Trophy, Zap, Target, Share2, CheckCircle2 } from 'lucide-react';

interface ResultModalProps {
  scoreRecord: GameScoreRecord;
  runner: RunnerCharacter;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  language?: 'km' | 'en';
}

export const ResultModal: React.FC<ResultModalProps> = ({
  scoreRecord,
  runner,
  onRestart,
  onOpenLeaderboard,
  language = 'km'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  const grade = calculateGrade(scoreRecord.wpm, scoreRecord.accuracy);
  const rankTitle = language === 'km' ? getRankTitleKm(grade) : getRankTitleEn(grade);

  // Confetti particles effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -100,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleShare = () => {
    const text = `🇰🇭 Khmer Typing Run 🏃\n⚡ WPM: ${scoreRecord.wpm} | 🎯 Accuracy: ${scoreRecord.accuracy}%\n🏆 Score: ${scoreRecord.score} | Grade: ${grade} (${rankTitle})\nRunner: ${runner.nameKm}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Canvas Confetti Background */}
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="pointer-events-none absolute inset-0 w-full h-full opacity-60"
        />

        {/* Content Container */}
        <div className="relative z-10 text-center">
          {/* Grade Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-4xl shadow-xl shadow-amber-500/30 mb-3 animate-bounce">
            {grade}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            {language === 'km' ? '🎉 បញ្ចប់ការប្រណាំង!' : '🎉 Race Complete!'}
          </h2>

          <p className="text-sm font-medium text-amber-300 mb-5">
            {rankTitle}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-left">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'ល្បឿន WPM' : 'Speed (WPM)'}</span>
              </div>
              <div className="text-3xl font-black font-mono tabular-nums text-white">
                {scoreRecord.wpm}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                CPM: <span className="font-mono text-cyan-300">{scoreRecord.cpm}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-left">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'ភាពសុក្រឹត' : 'Accuracy'}</span>
              </div>
              <div className="text-3xl font-black font-mono tabular-nums text-emerald-400">
                {scoreRecord.accuracy}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {language === 'km' ? 'កម្រិតបន្ត៖ ' : 'Max Streak: '}
                <span className="font-mono text-amber-300 font-bold">{scoreRecord.maxStreak}</span>
              </div>
            </div>

            <div className="col-span-2 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-400 block">
                  {language === 'km' ? 'ពិន្ទុសរុប (Total Score)' : 'Total Score'}
                </span>
                <span className="text-3xl font-black font-mono tabular-nums text-purple-300">
                  {scoreRecord.score}
                </span>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>{language === 'km' ? 'តួអង្គរត់៖ ' : 'Runner: '} <span className="text-slate-200 font-semibold">{runner.nameKm}</span></div>
                <div>{scoreRecord.duration}s · {scoreRecord.date}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onRestart}
              className="w-full flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'km' ? '🔄 លេងម្ដងទៀត' : '🔄 Play Again'}</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{language === 'km' ? 'តារាងពិន្ទុ' : 'Leaderboard'}</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
              title={language === 'km' ? 'ចម្លងលទ្ធផល' : 'Copy result to clipboard'}
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? (language === 'km' ? 'បានចម្លង!' : 'Copied!') : (language === 'km' ? 'ចែករំលែក' : 'Share')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
