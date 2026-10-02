import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface CustomPassageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, text: string) => void;
  language?: 'km' | 'en';
}

export const CustomPassageModal: React.FC<CustomPassageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language = 'km'
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError(language === 'km' ? 'សូមបញ្ចូលអត្ថបទខ្មែរយ៉ាងតិច ១០ តួអក្សរ' : 'Please input at least 10 Khmer characters');
      return;
    }
    onSubmit(title.trim() || (language === 'km' ? 'អត្ថបទផ្ទាល់ខ្លួន' : 'Custom Text'), text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">
              {language === 'km' ? 'បញ្ចូលអត្ថបទខ្មែរផ្ទាល់ខ្លួន' : 'Custom Khmer Text Practice'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'km' ? 'ចំណងជើង (ស្រេចចិត្ត)' : 'Title (Optional)'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'km' ? 'ឧ. កំណាព្យខ្មែរ, មេរៀន...' : 'e.g. Khmer Poem, Lesson...'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'km' ? 'ខ្លឹមសារអត្ថបទខ្មែរ' : 'Khmer Passage Content'}
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError('');
              }}
              placeholder={language === 'km' ? 'ចម្លង ឬវាយបញ្ចូលអត្ថបទខ្មែរនៅទីនេះ...' : 'Paste or type your Khmer text here...'}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm khmer-font focus:border-amber-400 outline-none resize-none"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
            >
              {language === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'km' ? 'ចាប់ផ្ដើមហាត់' : 'Start Practice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
