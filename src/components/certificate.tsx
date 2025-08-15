import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

interface CertificateProps {
  userName: string;
  domain: string;
  level: string;
  date: string;
}

export default function Certificate({ userName, domain, level, date }: CertificateProps) {
  const { t } = useLanguage();
  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl border-4 border-primary/50",
        "w-full max-w-[800px] mx-auto flex flex-col font-serif p-8"
      )} 
    >
      <div className="w-full h-full border-2 border-primary/30 p-6 flex flex-col items-center text-center">
        <header className="flex flex-col items-center">
            <BadgeCheck className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-primary mt-2" style={{fontFamily: "'Playfair Display', serif"}}>
                {t.certificate.title}
            </h1>
            <p className="text-base mt-2 text-muted-foreground">{t.certificate.awardedTo}</p>
        </header>
        
        <section className="flex-grow flex flex-col justify-center items-center py-4">
            <h2 className="text-3xl font-bold font-headline text-accent" style={{fontFamily: "'Playfair Display', serif"}}>
                {userName}
            </h2>

            <div className="mt-4 text-center">
                <p className="text-base text-muted-foreground">{t.certificate.forDemonstrating}</p>
                <p className="text-xl font-bold text-primary my-1">{level}</p>
                <p className="text-base text-muted-foreground">{t.certificate.inTheFieldOf}</p>
                <p className="text-xl font-bold text-primary mt-1">{domain}</p>
            </div>
        </section>

        <footer className="w-full flex justify-between items-end pt-4 mt-auto">
            <div className="text-left">
                <p className="font-bold text-sm">{t.certificate.platformName}</p>
                <p className="text-xs text-muted-foreground">{t.certificate.platformDescription}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-sm">{date}</p>
                <p className="text-xs text-muted-foreground">{t.certificate.dateIssued}</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
