import { format, subDays, addDays } from 'date-fns';
import { StudyRecord, Review } from '@/types/study';

// --- CONSTANTES DE DATA PARA OS MOCKS ---
const TODAY_DATE = new Date();
const TODAY_STR = format(TODAY_DATE, 'yyyy-MM-dd');
const YESTERDAY_STR = format(subDays(TODAY_DATE, 1), 'yyyy-MM-dd');
const TWO_DAYS_AGO_STR = format(subDays(TODAY_DATE, 2), 'yyyy-MM-dd');
const TOMORROW_STR = format(addDays(TODAY_DATE, 1), 'yyyy-MM-dd');

export const MOCK_STUDIES: StudyRecord[] = [
  // Cenario 1: Estudo Hoje -> Revisão Futura (Amanhã)
  {
    id: '1',
    discipline: 'Engenharia de Software',
    disciplineColor: 'purple',
    topic: 'Padrões de Projeto (MVC)',
    timeSpent: '02:00',
    date: TODAY_STR, // Feito HOJE
    createdAt: new Date().toISOString(),
    revisions: [],
    notes: 'Estudo fresco, revisão só amanhã.'
  },
  // Cenario 2: Estudo Ontem -> Revisão Hoje (Pendente)
  {
    id: '2',
    discipline: 'Banco de Dados',
    disciplineColor: 'blue',
    topic: 'Normalização e Formas Normais',
    timeSpent: '01:30',
    date: YESTERDAY_STR, // Feito ONTEM
    createdAt: new Date().toISOString(),
    revisions: [],
  },
  // Cenario 3: Estudo Anteontem -> Revisão Ontem (Atrasada)
  {
    id: '3',
    discipline: 'Inteligência Artificial',
    disciplineColor: 'navy',
    topic: 'Redes Neurais - Perceptron',
    timeSpent: '03:00',
    date: TWO_DAYS_AGO_STR, // Feito ANTEONTEM
    createdAt: new Date().toISOString(),
    revisions: [],
  }
];

export const MOCK_REVIEWS: Review[] = [
  // Revisão do Estudo 3 (IA): Era pra ontem -> ATRASADA
  {
    id: 'r1',
    studyRecordId: '3',
    discipline: 'Inteligência Artificial',
    disciplineColor: 'navy',
    topic: 'Redes Neurais - Perceptron',
    dueDate: YESTERDAY_STR, 
    completed: false,
  },
  // Revisão do Estudo 2 (Banco): É pra hoje -> HOJE
  {
    id: 'r2',
    studyRecordId: '2',
    discipline: 'Banco de Dados',
    disciplineColor: 'blue',
    topic: 'Normalização e Formas Normais',
    dueDate: TODAY_STR, 
    completed: false,
  },
  // Revisão do Estudo 1 (Eng Soft): É pra amanhã -> FUTURA
  {
    id: 'r3',
    studyRecordId: '1',
    discipline: 'Engenharia de Software',
    disciplineColor: 'purple',
    topic: 'Padrões de Projeto (MVC)',
    dueDate: TOMORROW_STR, 
    completed: false,
  }
];