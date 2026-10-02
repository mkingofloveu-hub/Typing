import React, { useState } from 'react';
import { GameScoreRecord } from '../types';
import { Trophy, X, Trash2, Medal, Zap, Target } from 'lucide-react';

interface LeaderboardModalProps {
  scores: GameScoreRecord[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  language?: 'km' | 'en';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  scores,
  isOpen,
  onClose,
  onClear,
  language = 'km'
}) => {
  const [filterDuration, setFilterDuration] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const filteredScores = scores.filter((s) => {
    if (filterDuration === 'all') return true;
    return s.duration === filterDuration;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">
              {language === 'km' ? 'តារាងជើងឯក (Leaderboard)' : 'Hall of Fame Leaderboard'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950/50 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">{language === 'km' ? 'តម្រៀប៖' : 'Filter:'}</span>
            {(['all', 30, 60, 120] as const).map((d) => (
              <button
                key={String(d)}
                onClick={() => setFilterDuration(d)}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                  filterDuration === d
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {d === 'all' ? (language === 'km' ? 'ទាំងអស់' : 'All') : `${d}s`}
              </button>
            ))}
          </div>

          {scores.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(language === 'km' ? 'តើអ្នកប្រាកដជាចង់លុបទិន្នន័យតារាងពិន្ទុមែនទេ?' : 'Clear all leaderboard records?')) {
                  onClear();
                }
              }}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'សម្អាត' : 'Clear'}</span>
            </button>
          )}
        </div>

        {/* Leaderboard Table / List */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredScores.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Trophy className="w-12 h-12 mx-auto text-slate-700 mb-2 opacity-50" />
              <p>{language === 'km' ? 'មិនទាន់មានកំណត់ត្រាពិន្ទុនៅឡើយទេ' : 'No race records yet'}</p>
              <p className="text-xs text-slate-600 mt-1">
                {language === 'km' ? 'ចូលរួមប្រកួតដើម្បីទទួលបានឈ្មោះនៅលើតារាង!' : 'Play a race to record your score!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredScores.map((record, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <div
                    key={record.id || index}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isTop1
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : isTop2
                        ? 'bg-slate-300/10 border-slate-300/30 text-slate-200'
                        : isTop3
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 text-center font-bold font-mono text-sm flex items-center justify-center">
                        {isTop1 ? (
                          <Medal className="w-5 h-5 text-amber-400" />
                        ) : isTop2 ? (
                          <Medal className="w-5 h-5 text-slate-300" />
                        ) : isTop3 ? (
                          <Medal className="w-5 h-5 text-orange-400" />
                        ) : (
                          `#${index + 1}`
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{record.score} pts</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {record.duration}s
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 truncate max-w-[200px] block">
                          {record.passageTitle || 'Khmer Practice'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="flex items-center justify-end gap-1 text-xs text-amber-300 font-mono">
                          <Zap className="w-3 h-3" />
                          <strong>{record.wpm}</strong> WPM
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-400 font-mono">
                          <Target className="w-3 h-3" />
                          <span>{record.accuracy}%</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 hidden sm:block">
                        {record.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            {language === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
