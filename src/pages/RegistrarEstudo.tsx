import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SuccessModal } from '@/components/ui/success-modal';

import { cn } from '@/lib/utils';
import { DISCIPLINES } from '@/types/study';
import { useStudy } from '@/contexts/StudyContext';
import { normalizeDate, formatDateForStorage } from '@/lib/date-utils'; 

// 1. Schema de Validação
const studySchema = z.object({
  disciplineId: z.string({ required_error: "Selecione uma disciplina." }),
  timeSpent: z.string().min(1, "Informe o tempo de estudo."),
  date: z.date({ required_error: "A data é obrigatória." }),
  topic: z.string().min(3, "O tema deve ter pelo menos 3 caracteres."),
  notes: z.string().optional(),
});

type StudyFormValues = z.infer<typeof studySchema>;

export default function RegistrarEstudo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const dateParam = searchParams.get('date');

  const { addStudyRecord, updateStudyRecord, studyRecords, algorithmSettings } = useStudy();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Inicialização do Form
  const form = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      disciplineId: '',
      timeSpent: '01:00',
      topic: '',
      notes: '',
      // Se não houver dataParam, deixa undefined para forçar o usuário a escolher ou usa data atual se preferir
      date: dateParam ? normalizeDate(dateParam) : new Date(), 
    },
  });

  // 3. Carregar dados para Edição
  useEffect(() => {
    if (editId) {
      const studyToEdit = studyRecords.find(s => s.id === editId);
      if (studyToEdit) {
        // Encontra o ID da disciplina baseado no nome salvo
        const disciplineObj = DISCIPLINES.find(d => d.name === studyToEdit.discipline);
        
        form.reset({
          disciplineId: disciplineObj?.id || '', 
          timeSpent: studyToEdit.timeSpent,
          date: normalizeDate(studyToEdit.date),
          topic: studyToEdit.topic,
          notes: studyToEdit.notes || '',
        });
      }
    }
  }, [editId, studyRecords, form]);

  const onSubmit = (data: StudyFormValues) => {
    // Busca os metadados da disciplina (Nome e Cor) baseado no ID selecionado
    const selectedDiscipline = DISCIPLINES.find(d => d.id === data.disciplineId);
    
    if (!selectedDiscipline) return; // Should not happen due to validation

    const formattedDate = formatDateForStorage(data.date);

    if (editId) {
      updateStudyRecord(editId, {
        discipline: selectedDiscipline.name,
        disciplineColor: selectedDiscipline.color,
        timeSpent: data.timeSpent,
        date: formattedDate,
        topic: data.topic,
        notes: data.notes,
      });
      setSuccessMessage("Registro atualizado com sucesso!");
    } else {
      addStudyRecord({
        discipline: selectedDiscipline.name,
        disciplineColor: selectedDiscipline.color,
        timeSpent: data.timeSpent,
        date: formattedDate,
        topic: data.topic,
        notes: data.notes,
      });

      // Feedback de Próxima Revisão
      const nextReviewDate = addDays(data.date, algorithmSettings.firstInterval);
      setSuccessMessage(`Estudo registrado! 1ª Revisão: ${format(nextReviewDate, "dd/MM/yyyy")}`);
    }
    
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/home');
  };

  return (
    <MainLayout title={editId ? "Editar Estudo" : "Novo Registro"}>
      <Card className="max-w-4xl animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{editId ? "Editar Detalhes" : "Detalhes do Estudo"}</CardTitle>
            <CardDescription>
              {editId ? "Altere as informações abaixo." : "Preencha os dados para gerar as revisões."}
            </CardDescription>
          </div>
          {editId && (
            <Button variant="ghost" onClick={() => navigate('/home')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* DISCIPLINA */}
                <FormField
                  control={form.control}
                  name="disciplineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disciplina</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISCIPLINES.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TEMPO */}
                <FormField
                  control={form.control}
                  name="timeSpent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Dedicado</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="time" className="h-12 pr-12" {...field} />
                        </FormControl>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">hrs</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DATA */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Data do Estudo</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-12 w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* TEMA */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema/Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Padrões de Projeto (Singleton)" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OBSERVAÇÕES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcionais)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Dificuldades encontradas, links úteis..." 
                        className="min-h-[120px] resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="px-8 min-w-[200px]">
                  {editId ? "ATUALIZAR REGISTRO" : "SALVAR ESTUDO"}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>

      <SuccessModal 
        open={showSuccess} 
        onClose={handleCloseSuccess}
        title={editId ? "Sucesso!" : "Estudo Agendado!"}
        message={successMessage}
      />
    </MainLayout>
  );
}