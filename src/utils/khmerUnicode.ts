/**
 * Khmer Unicode & Grapheme cluster utilities with NiDA keyboard mapping
 */

export function splitKhmerGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('km', { granularity: 'grapheme' });
      return [...segmenter.segment(text)].map((s) => s.segment);
    } catch {
      // fallback
    }
  }

  // Regex fallback for Khmer grapheme clusters if Intl.Segmenter is unavailable
  // Matches base consonant or independent vowel + optional Coeng + subconsonant + dependent vowels + diacritics
  const khmerClusterRegex = /[\u1780-\u17B3](?:[\u17D2][\u1780-\u17A2])*(?:[\u17B4-\u17C5]|[\u17C6-\u17D1]|[\u17D3])*|[\u17D4-\u17DD]|[\s\S]/g;
  const matches = text.match(khmerClusterRegex);
  return matches || [...text];
}

/**
 * Standard NiDA Khmer Keyboard layout mapping
 */
export interface KeyMapEntry {
  key: string;       // QWERTY key letter (e.g. 'k')
  code: string;      // Event code (e.g. 'KeyK')
  normal: string;    // Khmer character when unshifted
  shift: string;     // Khmer character when shifted
  altGr?: string;    // Optional AltGr
}

export const KHMER_KEYBOARD_ROWS: KeyMapEntry[][] = [
  // Row 1: Numbers
  [
    { key: '`', code: 'Backquote', normal: '«', shift: '»' },
    { key: '1', code: 'Digit1', normal: '១', shift: '!' },
    { key: '2', code: 'Digit2', normal: '២', shift: 'ៗ' },
    { key: '3', code: 'Digit3', normal: '៣', shift: '"' },
    { key: '4', code: 'Digit4', normal: '៤', shift: '$' },
    { key: '5', code: 'Digit5', normal: '៥', shift: '%' },
    { key: '6', code: 'Digit6', normal: '៦', shift: '៝' },
    { key: '7', code: 'Digit7', normal: '៧', shift: '័' },
    { key: '8', code: 'Digit8', normal: '៨', shift: '៍' },
    { key: '9', code: 'Digit9', normal: '៩', shift: '(' },
    { key: '0', code: 'Digit0', normal: '០', shift: ')' },
    { key: '-', code: 'Minus', normal: 'ឥ', shift: '៌' },
    { key: '=', code: 'Equal', normal: 'ឲ', shift: '+' }
  ],
  // Row 2: QWERTY
  [
    { key: 'q', code: 'KeyQ', normal: 'ឆ', shift: 'ឈ' },
    { key: 'w', code: 'KeyW', normal: 'ឹ', shift: 'ឺ' },
    { key: 'e', code: 'KeyE', normal: 'េ', shift: 'ែ' },
    { key: 'r', code: 'KeyR', normal: 'រ', shift: 'ឬ' },
    { key: 't', code: 'KeyT', normal: 'ត', shift: 'ទ' },
    { key: 'y', code: 'KeyY', normal: 'យ', shift: 'ួ' },
    { key: 'u', code: 'KeyU', normal: 'ុ', shift: 'ូ' },
    { key: 'i', code: 'KeyI', normal: 'ិ', shift: 'ី' },
    { key: 'o', code: 'KeyO', normal: 'ោ', shift: 'ៅ' },
    { key: 'p', code: 'KeyP', normal: 'ផ', shift: 'ភ' },
    { key: '[', code: 'BracketLeft', normal: 'ៀ', shift: 'ឿ' },
    { key: ']', code: 'BracketRight', normal: 'ឪ', shift: 'ឧ' },
    { key: '\\', code: 'Backslash', normal: 'ឰ', shift: '|' }
  ],
  // Row 3: ASDF
  [
    { key: 'a', code: 'KeyA', normal: 'អ', shift: 'ឫ' },
    { key: 's', code: 'KeyS', normal: 'ស', shift: 'ៃ' },
    { key: 'd', code: 'KeyD', normal: 'ដ', shift: 'ឌ' },
    { key: 'f', code: 'KeyF', normal: 'ថ', shift: 'ធ' },
    { key: 'g', code: 'KeyG', normal: 'ង', shift: 'អ' },
    { key: 'h', code: 'KeyH', normal: 'ហ', shift: 'ះ' },
    { key: 'j', code: 'KeyJ', normal: 'ញ', shift: '្' }, // SHIFT+J is COENG (Subscript marker)
    { key: 'k', code: 'KeyK', normal: 'ក', shift: 'គ' },
    { key: 'l', code: 'KeyL', normal: 'ល', shift: 'ឡ' },
    { key: ';', code: 'Semicolon', normal: 'ើ', shift: '៖' },
    { key: "'", code: 'Quote', normal: '់', shift: '៉' }
  ],
  // Row 4: ZXCV
  [
    { key: 'z', code: 'KeyZ', normal: 'ឋ', shift: 'ឍ' },
    { key: 'x', code: 'KeyX', normal: 'ខ', shift: 'ឃ' },
    { key: 'c', code: 'KeyC', normal: 'ច', shift: 'ជ' },
    { key: 'v', code: 'KeyV', normal: 'វ', shift: 'េះ' },
    { key: 'b', code: 'KeyB', normal: 'ប', shift: 'ព' },
    { key: 'n', code: 'KeyN', normal: 'ន', shift: 'ណ' },
    { key: 'm', code: 'KeyM', normal: 'ម', shift: 'ំ' },
    { key: ',', code: 'Comma', normal: 'កុំ', shift: '៛' },
    { key: '.', code: 'Period', normal: '។', shift: '៘' },
    { key: '/', code: 'Slash', normal: '៊', shift: '?' }
  ]
];

// Helper to look up which key generates a character
const charToKeyMap = new Map<string, { key: string; code: string; shift: boolean }>();

KHMER_KEYBOARD_ROWS.forEach(row => {
  row.forEach(item => {
    if (item.normal) charToKeyMap.set(item.normal, { key: item.key, code: item.code, shift: false });
    if (item.shift) charToKeyMap.set(item.shift, { key: item.key, code: item.code, shift: true });
  });
});

export function findKhmerKey(char: string): { key: string; code: string; shift: boolean } | null {
  return charToKeyMap.get(char) || null;
}

export function calculateGrade(wpm: number, accuracy: number): 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' {
  if (wpm >= 60 && accuracy >= 97) return 'S+';
  if (wpm >= 45 && accuracy >= 94) return 'S';
  if (wpm >= 35 && accuracy >= 90) return 'A';
  if (wpm >= 25 && accuracy >= 85) return 'B';
  if (wpm >= 15 && accuracy >= 75) return 'C';
  return 'D';
}

export function getRankTitleKm(grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'): string {
  switch (grade) {
    case 'S+': return 'កំពូលអ្នករត់លឿនដូចផ្លេកបន្ទោរ ⚡';
    case 'S': return 'អ្នកក្លាហានល្បឿនមាស 🏆';
    case 'A': return 'អ្នកប្រណាំងជំនាញជាន់ខ្ពស់ 🌟';
    case 'B': return 'អ្នករត់ល្បឿនមធ្យម 🏃';
    case 'C': return 'អ្នកហាត់រៀនមានសក្ដានុពល 🌾';
    case 'D': return 'អ្នកទើបចាប់ផ្ដើមដំណើរ 👣';
  }
}

export function getRankTitleEn(grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'): string {
  switch (grade) {
    case 'S+': return 'Lightning Master ⚡';
    case 'S': return 'Golden Shinobi 🏆';
    case 'A': return 'Elite Runner 🌟';
    case 'B': return 'Adept Sprinter 🏃';
    case 'C': return 'Steadfast Learner 🌾';
    case 'D': return 'Novice Explorer 👣';
  }
}
