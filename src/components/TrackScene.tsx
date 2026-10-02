import React from 'react';
import { RunnerCharacter } from '../types';

interface TrackSceneProps {
  runner: RunnerCharacter;
  progress: number; // 0 to 100
  isRunning: boolean;
  wpm: number;
  streak: number;
  environment?: 'angkor' | 'night' | 'sunset';
  language?: 'km' | 'en';
}

export const TrackScene: React.FC<TrackSceneProps> = ({
  runner,
  progress,
  isRunning,
  wpm,
  streak,
  language = 'km'
}) => {
  const isHighSpeed = wpm >= 40;
  const isSuperStreak = streak >= 15;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl transition-all">
      {/* Background Angkor Horizon Artwork */}
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800/80">
        {/* Distant stars & dawn glow */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900/0 to-transparent" />

        {/* Angkor Wat Silhouette SVG */}
        <svg
          className="absolute bottom-6 left-0 right-0 w-full h-18 text-slate-800/40 opacity-70 pointer-events-none"
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
        >
          {/* Temple towers silhouette */}
          <path
            fill="currentColor"
            d="M 50,120 L 70,80 L 80,60 L 90,80 L 110,120 
               M 200,120 L 220,70 L 235,40 L 245,20 L 255,40 L 270,70 L 290,120
               M 450,120 L 470,60 L 485,30 L 500,5 L 515,30 L 530,60 L 550,120
               M 710,120 L 730,70 L 745,40 L 755,20 L 765,40 L 780,70 L 800,120
               M 890,120 L 910,80 L 920,60 L 930,80 L 950,120"
          />
          {/* Palm trees silhouettes */}
          <path
            fill="currentColor"
            d="M 150,120 L 155,75 Q 140,60 130,70 Q 155,60 155,75 Q 160,50 170,55 Q 160,70 155,75 Z
               M 400,120 L 405,70 Q 390,55 380,65 Q 405,55 405,70 Q 410,45 420,50 Q 410,65 405,70 Z
               M 650,120 L 655,72 Q 640,58 630,68 Q 655,58 655,72 Q 660,48 670,52 Q 660,68 655,72 Z
               M 850,120 L 855,74 Q 840,60 830,70 Q 855,60 855,74 Q 860,50 870,54 Q 860,70 855,74 Z"
          />
        </svg>

        {/* Speed blur lines across the sky when typing fast */}
        {isRunning && isHighSpeed && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-4 left-1/4 animate-streaks" />
            <div className="h-0.5 w-36 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-10 left-1/2 animate-streaks" style={{ animationDelay: '0.4s' }} />
            <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-indigo-300 to-transparent absolute top-16 left-1/3 animate-streaks" style={{ animationDelay: '0.7s' }} />
          </div>
        )}

        {/* Distance Milestones along the track */}
        <div className="absolute bottom-8 left-4 right-4 flex justify-between text-[11px] font-mono text-slate-500 pointer-events-none">
          <span className="flex items-center gap-1">🚩 0m</span>
          <span>25m</span>
          <span className="hidden sm:inline">50m</span>
          <span>75m</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">🏁 100m</span>
        </div>

        {/* The Track Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-900 border-t border-slate-700/80">
          {/* Running Track Lane Lines */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-b border-dashed border-slate-700/60" />

          {/* Running progress bar on ground */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500 opacity-20 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Runner Entity */}
        <div
          className="absolute bottom-3 transform -translate-x-1/2 transition-all duration-200 ease-out z-20 flex flex-col items-center"
          style={{ left: `${Math.min(94, Math.max(5, progress))}%` }}
        >
          {/* Combo / Super Speed Speech Bubble */}
          {isRunning && (streak >= 10 || isHighSpeed) && (
            <div className="mb-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md animate-bounce whitespace-nowrap">
              {streak >= 20 ? '🔥 x2 Combo!' : isHighSpeed ? runner.speedQuoteKm : '⚡ Boost!'}
            </div>
          )}

          {/* Runner Avatar Sprite */}
          <div className="relative">
            {/* Speed aura ring */}
            {(isSuperStreak || isHighSpeed) && (
              <div className="absolute -inset-2 rounded-full bg-amber-400/30 blur-sm animate-ping pointer-events-none" />
            )}

            {/* Character icon */}
            <div
              className={`text-4xl filter drop-shadow-md select-none transition-transform ${
                isRunning ? 'animate-runner' : ''
              }`}
            >
              {runner.avatar}
            </div>

            {/* Running dust puff particles */}
            {isRunning && (
              <div
                className="absolute -bottom-1 -left-2 w-3 h-3 bg-slate-500/40 rounded-full blur-xs"
                style={{ animation: 'dustPuff 0.4s infinite' }}
              />
            )}
          </div>
        </div>

        {/* Finish line gate banner */}
        <div className="absolute bottom-0 right-4 h-16 w-3 border-r-2 border-emerald-400 flex flex-col justify-start items-center">
          <div className="text-xs bg-emerald-500 text-slate-950 font-bold px-1 rounded shadow">
            FINISH
          </div>
        </div>
      </div>

      {/* Progress Track Bar */}
      <div className="mt-3 flex items-center gap-3">
        <div className="text-xs font-mono font-medium text-slate-400 min-w-10">
          {Math.round(progress)}%
        </div>
        <div className="relative flex-1 h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-slate-400">
          {language === 'km' ? 'ចម្ងាយរត់' : 'Distance'}
        </div>
      </div>
    </div>
  );
};
