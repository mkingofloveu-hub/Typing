import React from 'react';
import { Timer, Zap, Target, Award, Flame } from 'lucide-react';

interface StatsBarProps {
  remainingTime: number;
  totalTime: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  score: number;
  streak: number;
  theme?: 'dark' | 'light';
  language?: 'km' | 'en';
}

export const StatsBar: React.FC<StatsBarProps> = ({
  remainingTime,
  totalTime,
  wpm,
  cpm,
  accuracy,
  score,
  streak,
  theme = 'dark',
  language = 'km'
}) => {
  const isDark = theme === 'dark';
  const isTimeCritical = remainingTime <= 10 && remainingTime > 0;

  // Streak multiplier
  let multiplier = '1.0x';
  if (streak >= 30) multiplier = '2.5x';
  else if (streak >= 20) multiplier = '2.0x';
  else if (streak >= 10) multiplier = '1.5x';
  else if (streak >= 5) multiplier = '1.2x';

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 rounded-2xl border transition-all ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
    } shadow-md`}>
      {/* Timer */}
      <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
        isTimeCritical
          ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
          : isDark
          ? 'bg-slate-950/60 border-slate-800/80 text-slate-200'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <Timer className="w-3.5 h-3.5" />
          <span>{language === 'km' ? 'ពេលវេលា' : 'Time'}</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums leading-none">
          {remainingTime}s
        </div>
        <span className="text-[10px] text-slate-500 mt-1">/ {totalTime}s</span>
      </div>

      {/* WPM */}
      <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${
        isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>WPM</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 leading-none">
          {wpm}
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          {language === 'km' ? 'ពាក្យ/នាទី' : 'words/min'}
        </span>
      </div>

      {/* CPM */}
      <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${
        isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 mb-1">
          <span>🔤</span>
          <span>CPM</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400 leading-none">
          {cpm}
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          {language === 'km' ? 'តួអក្សរ/នាទី' : 'chars/min'}
        </span>
      </div>

      {/* Accuracy */}
      <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${
        isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
          <Target className="w-3.5 h-3.5" />
          <span>{language === 'km' ? 'ភាពសុក្រឹត' : 'Accuracy'}</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 leading-none">
          {accuracy}%
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          {streak > 0 ? (
            <span className="text-orange-400 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 inline" /> {streak} {multiplier}
            </span>
          ) : (
            language === 'km' ? 'គ្មានកំហុស' : 'no miss'
          )}
        </span>
      </div>

      {/* Score */}
      <div className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2.5 rounded-xl border ${
        isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 text-xs text-purple-400 mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>{language === 'km' ? 'ពិន្ទុសរុប' : 'Score'}</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-purple-300 leading-none">
          {score}
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          {streak >= 10 ? '🔥 COMBO' : language === 'km' ? 'ពិន្ទុ' : 'points'}
        </span>
      </div>
    </div>
  );
};
