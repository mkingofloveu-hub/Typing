export type GameMode = 'time_attack' | 'endless_run' | 'words_sprint' | 'proverbs' | 'beginner_practice' | 'custom';

export type RunnerId = 'naruto' | 'angkor' | 'leopard' | 'speedster';

export interface RunnerCharacter {
  id: RunnerId;
  name: string;
  nameKm: string;
  avatar: string;
  trailColor: string;
  auraClass: string;
  speedQuoteKm: string;
}

export interface Passage {
  id: string;
  titleKm: string;
  titleEn: string;
  category: 'proverbs' | 'culture' | 'tech' | 'nature' | 'words' | 'beginner';
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  authorOrSourceKm?: string;
  authorOrSourceEn?: string;
}

export interface GameScoreRecord {
  id: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  score: number;
  date: string;
  mode: GameMode;
  duration: number; // in seconds
  runnerId: RunnerId;
  passageTitle: string;
  maxStreak: number;
  grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface KeyCapInfo {
  code: string;
  normal: string;
  shift: string;
  label?: string;
  width?: string;
}
