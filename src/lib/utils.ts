import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { i18n, type Language } from './i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getSkillInfo = (percentage: number, lang: Language, userName?: string): { level: 'Expert' | 'Confirmé / Avancé' | 'Intermédiaire' | 'Débutant / Amateur' | 'Advanced' | 'Intermediate' | 'Beginner', resultMessage: string, congratsMessage: string } => {
  const t = i18n[lang];

  if (percentage >= 80) return { 
    level: t.skillLevels.expert, 
    resultMessage: t.skillMessages.expertResult,
    congratsMessage: t.skillMessages.expertCongrats(percentage)
  };
  if (percentage >= 70) return { 
    level: lang === 'fr' ? t.skillLevels.advanced : 'Advanced', 
    resultMessage: t.skillMessages.advancedResult,
    congratsMessage: t.skillMessages.advancedCongrats(percentage) 
  };
  if (percentage >= 60) return { 
    level: t.skillLevels.intermediate, 
    resultMessage: t.skillMessages.intermediateResult,
    congratsMessage: t.skillMessages.intermediateCongrats(percentage)
  };
  return { 
    level: lang === 'fr' ? t.skillLevels.beginner : 'Beginner',
    resultMessage: t.skillMessages.beginnerResult,
    congratsMessage: t.skillMessages.beginnerCongrats
  };
};
