// src/components/history-drawer.tsx
'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuizHistory } from '@/hooks/use-quiz-history';
import { Trash2, User, Book, Calendar, Target, Award, Dumbbell } from 'lucide-react';

interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HistoryDrawer({ open, onOpenChange }: HistoryDrawerProps) {
  const { history, clearHistory } = useQuizHistory();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Historique des tests</SheetTitle>
          <SheetDescription>
            Voici la liste de vos évaluations passées. L'historique est sauvegardé localement.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Dumbbell className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Aucun historique</p>
                <p className="text-sm">Complétez un quiz pour le voir apparaître ici.</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {history.map((entry) => (
                  <Card key={entry.id} className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{entry.domain}</span>
                        <Badge variant="secondary">{entry.date}</Badge>
                      </CardTitle>
                      {entry.specialty && <CardDescription>{entry.specialty}</CardDescription>}
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <User className="h-4 w-4" />
                         <span>{entry.userName}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <Target className="h-4 w-4" />
                         <span>Score : {entry.score}/{entry.totalQuestions}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                         <Award className="h-4 w-4" />
                         <span>Niveau : {entry.level}</span>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        {history.length > 0 && (
          <SheetFooter>
            <Button variant="destructive" onClick={clearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Vider l'historique
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
