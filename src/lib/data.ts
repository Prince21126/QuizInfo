import type { Domain } from './types';

export const DOMAINS: Domain[] = [
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
