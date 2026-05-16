import React from "react";
import { ArrowRight, ArrowLeft, Globe, Briefcase } from "lucide-react";

interface SkillsStepProps {
  languages: string[];
  setLanguages: (langs: string[]) => void;
  skills: string;
  setSkills: (skills: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SkillsStep({
  languages, setLanguages, skills, setSkills, onNext, onBack
}: SkillsStepProps) {
  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };


  const availableLanguages = ["English", "Yoruba", "Igbo", "Hausa", "Pidgin"];


  return (
    <div className="flex-1 flex flex-col px-6 py-12">
      <button onClick={onBack} className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 text-sm mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Tell us about your skills</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Select all the skills you have experience with</p>
      </div>

      <div className="flex gap-1 mb-8">
        <div className="h-1 flex-1 bg-[#8b5cf6] rounded-full" />
        <div className="h-1 flex-1 bg-[#8b5cf6] rounded-full" />
        <div className="h-1 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>

      <div className="space-y-8 flex-1">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-4 text-zinc-800 dark:text-zinc-200">
            <Globe className="w-4 h-4 text-[#8b5cf6]" />
            Preferred Language
          </label>
          <div className="flex flex-wrap gap-3">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                  languages.includes(lang)
                    ? "bg-[#8b5cf6]/20 border-[#8b5cf6] text-zinc-900 dark:text-white"
                    : "bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-4 text-zinc-800 dark:text-zinc-200">
            <Briefcase className="w-4 h-4 text-[#8b5cf6]" />
            Your Skills
          </label>
          <textarea 
            rows={5}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="I know how to sew cloth"
            className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 focus:border-[#8b5cf6] dark:focus:border-[#8b5cf6] rounded-xl py-4 px-4 outline-none transition-all"
          />
        </div>
      </div>

      <div className="mt-8 pt-4">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all bg-[#8b5cf6] dark:bg-[#8b5cf6] text-white hover:bg-[#8b5cf6]/70 active:scale-[0.98]"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-6 h-1.5 rounded-full bg-[#8b5cf6]" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
