
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
    <div 
      className={cn(
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl border-4 border-primary/50",
        "w-full max-w-[800px] mx-auto flex flex-col font-serif p-8"
      )} 
      style={{ aspectRatio: '1.414 / 1' }}
    >
      <div className="w-full h-full border-2 border-primary/30 p-6 flex flex-col items-center text-center">
        <header className="flex flex-col items-center">
            <BadgeCheck className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary mt-2" style={{fontFamily: "'Playfair Display', serif"}}>
                Certificat de Réussite
            </h1>
            <p className="text-base md:text-lg mt-2 text-muted-foreground">Ce certificat est fièrement décerné à</p>
        </header>
        
        <section className="flex-grow flex flex-col justify-center items-center py-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent" style={{fontFamily: "'Playfair Display', serif"}}>
                {userName}
            </h2>

            <div className="mt-4 text-center">
                <p className="text-base md:text-lg text-muted-foreground">pour avoir démontré avec succès des compétences de niveau</p>
                <p className="text-xl md:text-2xl font-bold text-primary my-1">{level}</p>
                <p className="text-base md:text-lg text-muted-foreground">dans le domaine de</p>
                <p className="text-xl md:text-2xl font-bold text-primary mt-1">{domain}</p>
            </div>
        </section>

        <footer className="w-full flex justify-between items-end pt-4 mt-auto">
            <div className="text-left">
                <p className="font-bold text-base">Quiz Informatique</p>
                <p className="text-xs text-muted-foreground">Plateforme d'Évaluation</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-base">{date}</p>
                <p className="text-xs text-muted-foreground">Date d'émission</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
