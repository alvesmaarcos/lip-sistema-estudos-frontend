import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Schedule } from '../pages/Schedule';
import { DailyLog } from '../pages/DailyLog';
import { Revisions } from '../pages/Revisions';
import { Reports } from '../pages/Reports';
import { Settings } from '../pages/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cronograma" element={<Schedule />} />
      <Route path="/registrar" element={<DailyLog />} />
      <Route path="/revisoes" element={<Revisions />} />
      <Route path="/relatorios" element={<Reports />} />
      <Route path="/configuracoes" element={<Settings />} />
      
      {/* Redireciona qualquer rota desconhecida para o login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};