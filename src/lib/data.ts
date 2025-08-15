import type { Domain } from './types';
import type { Language } from './i18n';

const fr_domains: Domain[] = [
  {
    value: "Développement Logiciel",
    label: "Développement Logiciel",
    specialties: [
      { value: "Web Frontend", label: "Web Frontend (HTML, CSS, JS, React...)" },
      { value: "Web Backend", label: "Web Backend (Node.js, Python, Java...)" },
      { value: "Mobile", label: "Mobile (Kotlin, Swift, Flutter, React Native)" },
    ],
  },
  { value: "Réseaux et Télécommunications", label: "Réseaux et Télécommunications" },
  { value: "Cybersécurité", label: "Cybersécurité" },
  { value: "Intelligence Artificielle et Machine Learning", label: "IA et Machine Learning" },
  { value: "Analyse de Données", label: "Analyse de Données" },
  { value: "Infrastructure et Cloud Computing", label: "Infrastructure et Cloud" },
  { value: "Gestion de Bases de Données", label: "Gestion de Bases de Données" },
  { value: "Gestion de Projet IT", label: "Gestion de Projet IT (Agile, Scrum...)" },
];

const en_domains: Domain[] = [
    {
    value: "Software Development",
    label: "Software Development",
    specialties: [
      { value: "Web Frontend", label: "Web Frontend (HTML, CSS, JS, React...)" },
      { value: "Web Backend", label: "Web Backend (Node.js, Python, Java...)" },
      { value: "Mobile", label: "Mobile (Kotlin, Swift, Flutter, React Native)" },
    ],
  },
  { value: "Networks and Telecommunications", label: "Networks and Telecommunications" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Artificial Intelligence and Machine Learning", label: "AI and Machine Learning" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "Infrastructure and Cloud Computing", label: "Infrastructure and Cloud" },
  { value: "Database Management", label: "Database Management" },
  { value: "IT Project Management", label: "IT Project Management (Agile, Scrum...)" },
];

export const DOMAINS = (lang: Language): Domain[] => {
    return lang === 'fr' ? fr_domains : en_domains;
};
