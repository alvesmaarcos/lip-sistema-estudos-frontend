import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { useStudy } from '@/contexts/StudyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Revisoes() {
  const { 
    getOverdueReviews, 
    getTodayReviews, 
    getCompletedReviews, 
    toggleReviewComplete 
  } = useStudy();

  const overdueReviews = getOverdueReviews();
  const todayReviews = getTodayReviews();
  const completedReviews = getCompletedReviews();

  return (
    <MainLayout title="Minhas Revisões">
      <Tabs defaultValue="today" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="overdue" className="data-[state=active]:text-red-600">
            Atrasadas ({overdueReviews.length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Hoje ({todayReviews.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídas
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <TabsContent value="overdue" className="space-y-4 mt-0">
            {overdueReviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma revisão atrasada! 🎉</p>
            ) : (
              overdueReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  variant="overdue" // Passando variant correto
                  onToggle={() => toggleReviewComplete(review.id)} // [CORREÇÃO] onToggle
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4 mt-0">
            {todayReviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Tudo em dia por hoje.</p>
            ) : (
              todayReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  variant="today" // Passando variant correto
                  onToggle={() => toggleReviewComplete(review.id)} // [CORREÇÃO] onToggle
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-0">
            {completedReviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma revisão concluída ainda.</p>
            ) : (
              completedReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  variant="completed" // Passando variant correto
                  onToggle={() => toggleReviewComplete(review.id)} // [CORREÇÃO] onToggle
                />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </MainLayout>
  );
}