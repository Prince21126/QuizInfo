import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getSkillInfo = (percentage: number): { level: 'Expert' | 'Confirmé / Avancé' | 'Intermédiaire' | 'Débutant / Amateur', resultMessage: string, congratsMessage: string } => {
  if (percentage >= 80) return { 
    level: 'Expert', 
    resultMessage: "Votre expertise est impressionnante. Continuez à explorer les sujets avancés.",
    congratsMessage: `Félicitations, ${percentage}% c'est un score d'expert !`
  };
  if (percentage >= 70) return { 
    level: 'Confirmé / Avancé', 
    resultMessage: "Vous maîtrisez bien le sujet. Approfondissez vos connaissances pour devenir un expert.",
    congratsMessage: `Félicitations, ${percentage}% est un excellent score !` 
  };
  if (percentage >= 60) return { 
    level: 'Intermédiaire', 
    resultMessage: "Vous avez de solides connaissances ! Continuez sur cette lancée pour consolider vos acquis.",
    congratsMessage: `Bravo pour ce ${percentage}% !`
  };
  return { 
    level: 'Débutant / Amateur', 
    resultMessage: "C'est un bon début ! Les ressources ci-dessous vous aideront à construire une base solide.",
    congratsMessage: "Chaque expert a commencé par les bases."
  };
};
