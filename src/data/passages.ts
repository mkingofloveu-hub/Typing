import { Passage, RunnerCharacter } from '../types';

export const RUNNER_CHARACTERS: RunnerCharacter[] = [
  {
    id: 'naruto',
    name: 'Naruto Shinobi',
    nameKm: 'ណារូតូ និនចា',
    avatar: '🥷',
    trailColor: 'from-amber-500 to-orange-600',
    auraClass: 'shadow-orange-500/50',
    speedQuoteKm: 'ល្បឿនខ្យល់ព្យុះ!'
  },
  {
    id: 'angkor',
    name: 'Angkor Warrior',
    nameKm: 'អ្នកក្លាហានអង្គរ',
    avatar: '🛡️',
    trailColor: 'from-amber-400 to-yellow-600',
    auraClass: 'shadow-amber-400/50',
    speedQuoteKm: 'អំណាចមហានគរ!'
  },
  {
    id: 'leopard',
    name: 'Cloud Leopard',
    nameKm: 'ខ្លាពពក',
    avatar: '🐆',
    trailColor: 'from-emerald-400 to-teal-600',
    auraClass: 'shadow-emerald-400/50',
    speedQuoteKm: 'រហ័សរហួនឥតគូ!'
  },
  {
    id: 'speedster',
    name: 'Speed Runner',
    nameKm: 'អ្នករត់ប្រណាំង',
    avatar: '🏃',
    trailColor: 'from-cyan-400 to-blue-600',
    auraClass: 'shadow-cyan-400/50',
    speedQuoteKm: 'ឆ្ពោះទៅមុខជានិច្ច!'
  }
];

export const PASSAGES: Passage[] = [
  // User's original passages
  {
    id: 'orig-1',
    category: 'culture',
    titleKm: 'វប្បធម៌ និងប្រវត្តិសាស្ត្រខ្មែរ',
    titleEn: 'Khmer Culture & History',
    text: 'ប្រទេសកម្ពុជាគឺជាប្រទេសមួយដែលមានវប្បធម៌ប្រពៃណី និងប្រវត្តិសាស្ត្រដ៏សម្បូរបែប។ ប្រជាជនខ្មែរមានភាពរួសរាយរាក់ទាក់ និងស្រឡាញ់សន្តិភាព។',
    difficulty: 'easy'
  },
  {
    id: 'orig-2',
    category: 'culture',
    titleKm: 'សារៈសំខាន់នៃការសិក្សា',
    titleEn: 'Importance of Education',
    text: 'ការសិក្សាគឺជាគន្លឹះដ៏សំខាន់សម្រាប់អនាគត។ សិស្សគួរតែខិតខំរៀនសូត្រ អានសៀវភៅ និងអភិវឌ្ឍចំណេះដឹងរបស់ខ្លួនជារៀងរាល់ថ្ងៃ។',
    difficulty: 'easy'
  },
  {
    id: 'orig-3',
    category: 'tech',
    titleKm: 'បច្ចេកវិទ្យា និងពិភពលោក',
    titleEn: 'Technology & The World',
    text: 'បច្ចេកវិទ្យាបានផ្លាស់ប្តូររបៀបរស់នៅរបស់មនុស្ស។ កុំព្យូទ័រ និងអ៊ីនធឺណិតអាចជួយយើងសិក្សា ធ្វើការ និងទំនាក់ទំនងជាមួយមនុស្សនៅជុំវិញពិភពលោក។',
    difficulty: 'medium'
  },
  {
    id: 'orig-4',
    category: 'nature',
    titleKm: 'ការថែរក្សាបរិស្ថាន',
    titleEn: 'Environmental Care',
    text: 'ការថែរក្សាបរិស្ថានគឺជាកាតព្វកិច្ចរបស់យើងទាំងអស់គ្នា។ យើងគួរកាត់បន្ថយការប្រើប្រាស់ប្លាស្ទិក ដាំដើមឈើ និងរក្សាអនាម័យនៅក្នុងសហគមន៍។',
    difficulty: 'medium'
  },
  {
    id: 'orig-5',
    category: 'proverbs',
    titleKm: 'គន្លឹះឆ្ពោះទៅជោគជ័យ',
    titleEn: 'Keys to Success',
    text: 'ជោគជ័យមិនមែនកើតឡើងដោយចៃដន្យទេ។ វាត្រូវការការខិតខំប្រឹងប្រែង ការអត់ធ្មត់ និងការមិនបោះបង់នៅពេលជួបបញ្ហា។',
    difficulty: 'easy'
  },

  // Khmer Proverbs (សុភាសិតខ្មែរ)
  {
    id: 'prov-1',
    category: 'proverbs',
    titleKm: 'សុភាសិត៖ ចំណេះវិជ្ជា',
    titleEn: 'Proverb: Wisdom & Skill',
    text: 'ចេះដប់មិនស្មើប្រសប់មួយ។ រៀនហើយត្រូវអនុវត្ត ទើបកើតជាប្រយោជន៍ដល់ខ្លួន និងសង្គមជាតិ។',
    difficulty: 'easy',
    authorOrSourceKm: 'សុភាសិតបុរាណខ្មែរ'
  },
  {
    id: 'prov-2',
    category: 'proverbs',
    titleKm: 'សុភាសិត៖ ការសេពគប់',
    titleEn: 'Proverb: Companionship',
    text: 'កុំទុកចិត្តមេឃ កុំទុកចិត្តផ្កាយ កុំទុកចិត្តពាក្យមនុស្សនិយាយ ស្រឡាញ់ពិតមិនល្អិតល្អោច។ សេចក្ដីព្យាយាមគង់បានសម្រេច។',
    difficulty: 'medium',
    authorOrSourceKm: 'សុភាសិតបុរាណខ្មែរ'
  },
  {
    id: 'prov-3',
    category: 'proverbs',
    titleKm: 'សុភាសិត៖ ស្ទឹងជ្រៅបាតស្ងាត់',
    titleEn: 'Proverb: Deep Waters Run Silent',
    text: 'ស្ទឹងជ្រៅបាតស្ងាត់ អ្នកប្រាជ្ញស្ងៀមស្ងាត់មិនអួតអាង។ ទឹកថ្លាឈ្វេងឃើញត្រីហែល សម្ដីផ្អែមល្ហែមនាំឱ្យគេស្រឡាញ់រាប់អាន។',
    difficulty: 'medium',
    authorOrSourceKm: 'ក្បួនទូន្មានខ្មែរ'
  },

  // Cultural Heritage & Angkor
  {
    id: 'angkor-1',
    category: 'culture',
    titleKm: 'មហាសម្បត្តិប្រាសាទអង្គរវត្ត',
    titleEn: 'Angkor Wat Heritage',
    text: 'ប្រាសាទអង្គរវត្តជាស្នាដៃឯកនៃស្ថាបត្យកម្មខ្មែរសម័យបុរាណ ដែលសាងសង់ឡើងក្នុងរជ្ជកាលព្រះបាទសូរ្យវរ្ម័នទី២។ វាជាមោទនភាពជាតិខ្មែរទូទាំងសកលលោក។',
    difficulty: 'hard'
  },
  {
    id: 'angkor-2',
    category: 'culture',
    titleKm: 'ប្រាសាទបាយ័ន និងស្នាមញញឹមខ្មែរ',
    titleEn: 'Bayon Temple & The Khmer Smile',
    text: 'ប្រាសាទបាយ័នមានមុខព្រហ្មញញឹមយ៉ាងស្រស់ស្រាយ បង្ហាញពីមេត្តា ករុណា មុទិតា និងឧបេក្ខា ដែលជាគុណធម៌ដ៏ខ្ពង់ខ្ពស់ក្នុងការរស់នៅ។',
    difficulty: 'hard'
  },

  // Fast Word Sprint
  {
    id: 'words-1',
    category: 'words',
    titleKm: 'ល្បឿនពាក្យសាមញ្ញ ១',
    titleEn: 'Common Words Sprint 1',
    text: 'ផ្ទះ ទឹក ភ្លើង ខ្យល់ មេឃ ដី ដើមឈើ សៀវភៅ ប៊ិច តុ កៅអី សាលារៀន មិត្តភក្តិ គ្រួសារ សេចក្តីសុខ សេចក្តីស្រឡាញ់ ញញឹម សើច រត់ ដើរ ហែលទឹក សប្បាយ',
    difficulty: 'easy'
  },
  {
    id: 'words-2',
    category: 'words',
    titleKm: 'ល្បឿនពាក្យសាមញ្ញ ២',
    titleEn: 'Common Words Sprint 2',
    text: 'កម្ពុជា ភ្នំពេញ សៀមរាប បាត់ដំបង កំពត កែប កោះកុង មណ្ឌលគិរី រតនគិរី ព្រះវិហារ ស្ទឹងត្រែង ក្រចេះ កំពង់ចាម ព្រៃវែង ស្វាយរៀង កណ្ដាល',
    difficulty: 'medium'
  },

  // Beginner exercises for learning Khmer Keyboard
  {
    id: 'beginner-1',
    category: 'beginner',
    titleKm: 'ហ្វឹកហាត់ព្យញ្ជនៈមូលដ្ឋាន',
    titleEn: 'Basic Consonants Drill',
    text: 'ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ',
    difficulty: 'easy'
  },
  {
    id: 'beginner-2',
    category: 'beginner',
    titleKm: 'ហ្វឹកហាត់ស្រៈនិស្ស័យ',
    titleEn: 'Khmer Dependent Vowels',
    text: 'កា កិ កី កline កឹ កឺ កុ កូ កួ កើ កឿ កៀ កេ កែ កៃ កោ កៅ កុំ កំ កាំ កះ កុះ កេះ កោះ',
    difficulty: 'easy'
  }
];
