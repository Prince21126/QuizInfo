import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';

interface CertificateProps {
  userName: string;
  domain: string;
  level: string;
  date: string;
}

export default function Certificate({ userName, domain, level, date }: CertificateProps) {
  return (
    <div className={cn(
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 rounded-lg shadow-2xl border-4 border-primary/50",
        "w-full max-w-[800px] mx-auto flex flex-col font-serif"
      )} style={{aspectRatio: '1.414 / 1'}}>
      <div className="w-full h-full border-2 border-primary/30 p-6 flex flex-col items-center justify-between text-center">
        <header className="flex flex-col items-center">
            <BadgeCheck className="h-20 w-20 text-primary mb-4" />
            <h1 className="font-headline text-5xl font-bold text-primary" style={{fontFamily: "'Playfair Display', serif"}}>
                Certificat de Réussite
            </h1>
            <p className="text-xl mt-4 text-muted-foreground">Ce certificat est fièrement décerné à</p>
        </header>
        
        <section className="my-4">
            <h2 className="text-6xl font-bold font-headline text-accent" style={{fontFamily: "'Playfair Display', serif"}}>
                {userName}
            </h2>
        </section>

        <section className="mb-4 text-center">
            <p className="text-xl text-muted-foreground">pour avoir démontré avec succès des compétences de niveau</p>
            <p className="text-3xl font-bold text-primary my-2">{level}</p>
            <p className="text-xl text-muted-foreground">dans le domaine de</p>
            <p className="text-3xl font-bold text-primary mt-2">{domain}</p>
        </section>

        <footer className="w-full flex justify-between items-center mt-auto pt-4">
            <div className="text-left">
                <p className="font-bold text-lg">Quiz Informatique</p>
                <p className="text-sm text-muted-foreground">Plateforme d'Évaluation</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg">{date}</p>
                <p className="text-sm text-muted-foreground">Date d'émission</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
