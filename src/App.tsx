/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Trophy, 
  BookOpen
} from 'lucide-react';
import { GameMode, RunnerCharacter, Passage, GameScoreRecord } from './types';
import { RUNNER_CHARACTERS, PASSAGES } from './data/passages';
import { splitKhmerGraphemes, calculateGrade } from './utils/khmerUnicode';
import { sound } from './utils/audio';
import { TrackScene } from './components/TrackScene';
import { StatsBar } from './components/StatsBar';
import { ResultModal } from './components/ResultModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { CustomPassageModal } from './components/CustomPassageModal';

export default function App() {
  // Theme & Language
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('khmerTypingTheme') as 'dark' | 'light') || 'dark';
  });
  const [language, setLanguage] = useState<'km' | 'en'>('km');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game Configuration
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedRunner, setSelectedRunner] = useState<RunnerCharacter>(RUNNER_CHARACTERS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPassage, setCurrentPassage] = useState<Passage>(PASSAGES[0]);

  // Game States
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Typing Mechanics
  const [inputText, setInputText] = useState('');
  const [graphemes, setGraphemes] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalCompletedPassages, setTotalCompletedPassages] = useState(0);

  // Modals
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [latestResult, setLatestResult] = useState<GameScoreRecord | null>(null);
  const [scores, setScores] = useState<GameScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('khmerTypingScores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const textDisplayRef = useRef<HTMLDivElement | null>(null);

  // Save Theme
  useEffect(() => {
    localStorage.setItem('khmerTypingTheme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-slate-100', 'text-slate-900');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-100', 'text-slate-900');
    }
  }, [theme]);

  // Sound toggle
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Prepare Passage
  const loadPassage = useCallback((passageToLoad?: Passage) => {
    let p = passageToLoad;
    if (!p) {
      let filtered = PASSAGES;
      if (selectedCategory !== 'all') {
        filtered = PASSAGES.filter((item) => item.category === selectedCategory);
      }
      p = filtered[Math.floor(Math.random() * filtered.length)] || PASSAGES[0];
    }
    setCurrentPassage(p);
    const segs = splitKhmerGraphemes(p.text);
    setGraphemes(segs);
    setInputText('');
  }, [selectedCategory]);

  useEffect(() => {
    loadPassage();
  }, [loadPassage]);

  // End Game
  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setPaused(false);

    sound.playFinish();

    const elapsedMin = Math.max(0.1, ((startTime ? Date.now() - startTime : selectedDuration * 1000) / 60000));
    const totalTyped = correctCount + incorrectCount;
    const finalWpm = Math.max(0, Math.round((correctCount / 5) / elapsedMin));
    const finalCpm = Math.max(0, Math.round(correctCount / elapsedMin));
    const finalAccuracy = totalTyped === 0 ? 100 : Math.round((correctCount / totalTyped) * 100);
    const finalScore = Math.max(0, Math.round((correctCount * 10 - incorrectCount * 4) + (maxStreak * 2)));

    const record: GameScoreRecord = {
      id: String(Date.now()),
      wpm: finalWpm,
      cpm: finalCpm,
      accuracy: finalAccuracy,
      score: finalScore,
      date: new Date().toLocaleDateString(),
      mode: 'time_attack',
      duration: selectedDuration,
      runnerId: selectedRunner.id,
      passageTitle: currentPassage.titleKm,
      maxStreak,
      grade: calculateGrade(finalWpm, finalAccuracy)
    };

    setLatestResult(record);

    setScores((prev) => {
      const updated = [record, ...prev].sort((a, b) => b.score - a.score).slice(0, 50);
      try {
        localStorage.setItem('khmerTypingScores', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, [correctCount, currentPassage.titleKm, incorrectCount, maxStreak, selectedDuration, selectedRunner.id, startTime]);

  // Timer Tick
  useEffect(() => {
    if (started && !paused) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          if (prev <= 4) {
            sound.playCountdownTick(prev === 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, paused, endGame]);

  // Start Game Handler
  const handleStart = () => {
    if (started && !paused) return;
    if (!started) {
      setRemainingTime(selectedDuration);
      setCorrectCount(0);
      setIncorrectCount(0);
      setStreak(0);
      setMaxStreak(0);
      setTotalCompletedPassages(0);
      setInputText('');
      setStartTime(Date.now());
      setLatestResult(null);
      loadPassage();
      setStarted(true);
    }
    setPaused(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Pause Game Handler
  const handlePause = () => {
    if (!started || remainingTime <= 0) return;
    setPaused((prev) => !prev);
    if (paused) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Restart Handler
  const handleRestart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setPaused(false);
    setRemainingTime(selectedDuration);
    setInputText('');
    setCorrectCount(0);
    setIncorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalCompletedPassages(0);
    setLatestResult(null);
    loadPassage();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Typing Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started) {
      handleStart();
    }
    if (paused) return;

    const val = e.target.value;
    const typedGraphemes = splitKhmerGraphemes(val);

    let currentCorrect = 0;
    let currentIncorrect = 0;
    let currentStreak = 0;
    let highestStreak = maxStreak;

    // Evaluate typed vs target
    for (let i = 0; i < typedGraphemes.length; i++) {
      if (typedGraphemes[i] === graphemes[i]) {
        currentCorrect++;
        currentStreak++;
        if (currentStreak > highestStreak) highestStreak = currentStreak;
      } else {
        currentIncorrect++;
        currentStreak = 0;
      }
    }

    // Audio cues on latest keystroke
    if (typedGraphemes.length > 0) {
      const lastIndex = typedGraphemes.length - 1;
      const isLastCorrect = typedGraphemes[lastIndex] === graphemes[lastIndex];
      sound.playKey(isLastCorrect);

      if (isLastCorrect && currentStreak > 0 && currentStreak % 10 === 0) {
        sound.playComboChime(currentStreak);
      }
    }

    setInputText(val);
    setCorrectCount(currentCorrect);
    setIncorrectCount(currentIncorrect);
    setStreak(currentStreak);
    setMaxStreak(highestStreak);

    // Auto Advance when passage completed
    if (typedGraphemes.length >= graphemes.length && graphemes.length > 0) {
      sound.playWordComplete();
      setTotalCompletedPassages((c) => c + 1);
      setInputText('');
      loadPassage();
    }
  };

  // Computed Real-time Stats
  const elapsedMinutes = Math.max(0.016, ((startTime ? Date.now() - startTime : (selectedDuration - remainingTime) * 1000) / 60000));
  const currentWpm = started ? Math.max(0, Math.round((correctCount / 5) / elapsedMinutes)) : 0;
  const currentCpm = started ? Math.max(0, Math.round(correctCount / elapsedMinutes)) : 0;
  const totalTypedGraphemes = correctCount + incorrectCount;
  const currentAccuracy = totalTypedGraphemes === 0 ? 100 : Math.round((correctCount / totalTypedGraphemes) * 100);
  const currentScore = Math.max(0, (correctCount * 10 - incorrectCount * 4) + (streak * 2));

  // Progress percentage of current passage
  const typedGraphemes = splitKhmerGraphemes(inputText);
  const progressPercent = graphemes.length > 0 ? Math.min(100, (typedGraphemes.length / graphemes.length) * 100) : 0;
  const currentChar = typedGraphemes.length < graphemes.length ? graphemes[typedGraphemes.length] : null;

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 3-ZONE TOP BAR CONTRACT */}
      <header className={`px-4 sm:px-8 py-3.5 border-b flex items-center justify-between transition-colors ${
        theme === 'dark' ? 'bg-slate-950/80 border-slate-800/80 backdrop-blur' : 'bg-white/80 border-slate-200 backdrop-blur'
      }`}>
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">🇰🇭</span>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            Khmer Typing Run
          </span>
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            · វាយអក្សរខ្មែររហ័ស
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button 
            onClick={() => { setSelectedCategory('all'); loadPassage(); }} 
            className="hover:text-amber-400 transition-colors"
          >
            {language === 'km' ? 'ហាត់រៀនទូទៅ' : 'Practice'}
          </button>
          <button 
            onClick={() => { setSelectedCategory('proverbs'); loadPassage(); }} 
            className="hover:text-amber-400 transition-colors"
          >
            {language === 'km' ? 'សុភាសិតខ្មែរ' : 'Proverbs'}
          </button>
          <button 
            onClick={() => { setSelectedCategory('words'); loadPassage(); }} 
            className="hover:text-amber-400 transition-colors"
          >
            {language === 'km' ? 'ល្បឿនពាក្យ' : 'Word Sprint'}
          </button>
          <button 
            onClick={() => setShowLeaderboard(true)} 
            className="hover:text-amber-400 transition-colors"
          >
            {language === 'km' ? 'តារាងជើងឯក' : 'Leaderboard'}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            {language === 'km' ? '🇬🇧 EN' : '🇰🇭 ខ្មែរ'}
          </button>

          {/* Leaderboard CTA */}
          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        
        {/* HERO TITLE & MASCOT BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{language === 'km' ? '🇰🇭 ប្រកួតរត់វាយអក្សរខ្មែរ' : '🇰🇭 Khmer Typing Run'}</span>
              <span className="text-amber-400 text-lg">🏃</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'km' 
                ? `ជួយ ${selectedRunner.nameKm} រត់ទៅកាន់គោលដៅដោយវាយអក្សរខ្មែរឱ្យបានលឿន និងត្រឹមត្រូវ!`
                : `Help ${selectedRunner.name} reach the finish line by typing Khmer quickly and accurately!`}
            </p>
          </div>

          {/* Runner Character Selector */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">
              {language === 'km' ? 'តួអង្គ៖' : 'Runner:'}
            </span>
            {RUNNER_CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedRunner(char)}
                className={`p-2 rounded-xl border text-xl transition-all ${
                  selectedRunner.id === char.id
                    ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title={language === 'km' ? char.nameKm : char.name}
              >
                {char.avatar}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Left: Duration Selector & Passage Category */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Duration */}
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
              {[30, 60, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setSelectedDuration(sec);
                    if (!started) setRemainingTime(sec);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                    selectedDuration === sec
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                loadPassage();
              }}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700"
            >
              <option value="all">{language === 'km' ? '📚 ទាំងអស់ (All Topics)' : '📚 All Topics'}</option>
              <option value="culture">{language === 'km' ? '🏛️ វប្បធម៌ និងប្រវត្តិសាស្ត្រ' : '🏛️ Culture & History'}</option>
              <option value="proverbs">{language === 'km' ? '🪷 សុភាសិតខ្មែរ' : '🪷 Khmer Proverbs'}</option>
              <option value="words">{language === 'km' ? '⚡ ល្បឿនពាក្យ (Word Sprint)' : '⚡ Word Sprint'}</option>
            </select>

            {/* Custom Passage Button */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white bg-slate-950 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'km' ? 'អត្ថបទផ្ទាល់ខ្លួន' : 'Custom Text'}</span>
            </button>
          </div>

          {/* Right: Primary Game Controls */}
          <div className="flex items-center gap-2">
            {!started ? (
              <button
                onClick={handleStart}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all transform active:scale-95 shadow-md shadow-amber-500/20 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{language === 'km' ? '▶ ចាប់ផ្តើមរត់' : '▶ Start Run'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  paused
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {paused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{paused ? (language === 'km' ? 'បន្ត' : 'Resume') : (language === 'km' ? 'ផ្អាក' : 'Pause')}</span>
              </button>
            )}

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
              title={language === 'km' ? 'ចាប់ផ្តើមឡើងវិញ' : 'Restart'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* REAL-TIME STATS BAR */}
        <StatsBar
          remainingTime={remainingTime}
          totalTime={selectedDuration}
          wpm={currentWpm}
          cpm={currentCpm}
          accuracy={currentAccuracy}
          score={currentScore}
          streak={streak}
          theme={theme}
          language={language}
        />

        {/* TRACK ANIMATION SCENE */}
        <TrackScene
          runner={selectedRunner}
          progress={progressPercent}
          isRunning={started && !paused}
          wpm={currentWpm}
          streak={streak}
          language={language}
        />

        {/* TYPING PASSAGE DISPLAY & INPUT ARENA */}
        <div className={`p-5 rounded-3xl border transition-all ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xl space-y-4`}>
          
          {/* Header of Passage */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">{currentPassage.titleKm}</span>
              {currentPassage.authorOrSourceKm && (
                <span className="text-slate-500">· {currentPassage.authorOrSourceKm}</span>
              )}
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span>{typedGraphemes.length} / {graphemes.length} {language === 'km' ? 'តួអក្សរ' : 'chars'}</span>
              {totalCompletedPassages > 0 && (
                <span className="text-emerald-400 font-semibold">
                  · {totalCompletedPassages} {language === 'km' ? 'វគ្គបានចប់' : 'completed'}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Grapheme Highlighting Display */}
          <div
            ref={textDisplayRef}
            className={`min-h-[140px] max-h-[220px] overflow-y-auto p-4 rounded-2xl border text-xl sm:text-2xl leading-relaxed khmer-font select-none transition-colors ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {graphemes.map((char, index) => {
              const isTyped = index < typedGraphemes.length;
              const isCurrent = index === typedGraphemes.length;
              const isCorrect = isTyped && typedGraphemes[index] === char;
              const isIncorrect = isTyped && !isCorrect;

              return (
                <span
                  key={index}
                  className={`relative transition-colors duration-75 ${
                    isCorrect
                      ? 'text-emerald-400 font-medium'
                      : isIncorrect
                      ? 'text-rose-400 bg-rose-500/20 rounded px-0.5'
                      : 'text-slate-400'
                  } ${isCurrent ? 'border-b-2 border-amber-400 bg-amber-400/10 text-white animate-pulse' : ''}`}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Input Textarea Area */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  handleRestart();
                }
              }}
              placeholder={language === 'km' ? 'ចាប់ផ្តើមវាយអក្សរខ្មែរនៅទីនេះ...' : 'Start typing Khmer characters here...'}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              disabled={remainingTime <= 0}
              className={`w-full h-24 p-3.5 rounded-2xl border text-lg sm:text-xl khmer-font outline-none transition-all resize-none ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 focus:border-amber-400 text-white placeholder:text-slate-600'
                  : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400'
              }`}
            />

            {/* Quick Helper Badge */}
            <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 pointer-events-none flex items-center gap-1.5">
              <span>{language === 'km' ? 'ចុច Tab ដើម្បីចាប់ផ្តើមឡើងវិញ' : 'Press Tab to restart'}</span>
            </div>
          </div>
        </div>

      </main>

      {/* RESULT MODAL */}
      {latestResult && (
        <ResultModal
          scoreRecord={latestResult}
          runner={selectedRunner}
          onRestart={handleRestart}
          onOpenLeaderboard={() => {
            setShowLeaderboard(true);
          }}
          language={language}
        />
      )}

      {/* LEADERBOARD MODAL */}
      <LeaderboardModal
        scores={scores}
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        onClear={() => {
          localStorage.removeItem('khmerTypingScores');
          setScores([]);
        }}
        language={language}
      />

      {/* CUSTOM PASSAGE MODAL */}
      <CustomPassageModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={(title, text) => {
          const customP: Passage = {
            id: 'custom-' + Date.now(),
            category: 'culture',
            titleKm: title,
            titleEn: title,
            text: text,
            difficulty: 'medium'
          };
          loadPassage(customP);
          handleRestart();
        }}
        language={language}
      />

      {/* QUIET FOOTER */}
      <footer className="mt-12 py-6 text-center text-xs text-slate-500 border-t border-slate-800/40">
        <p>
          Khmer Typing Run 🏃 · គាំទ្រការរៀនវាយអក្សរខ្មែរ យូនីកូដ
        </p>
      </footer>
    </div>
  );
}
