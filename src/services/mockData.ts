/**
 * Mock Data - Dados simulados para desenvolvimento
 * Simula uma base de dados local (consultas e médicos)
 */

import { Consulta, Especialidade } from "../types";
import { Medico } from "../interfaces/medico";

/** Médicos disponíveis no sistema (agendamento + login de teste) */
export const medicosMock: Medico[] = [
  {
    id: 1,
    nome: "Dr. Roberto Silva",
    crm: "CRM/SP 123456",
    especialidade: "Cardiologia",
    ativo: true,
  },
  {
    id: 2,
    nome: "Dra. Maria Santos",
    crm: "CRM/SP 234567",
    especialidade: "Dermatologia",
    ativo: true,
  },
  {
    id: 3,
    nome: "Dr. João Pereira",
    crm: "CRM/SP 345678",
    especialidade: "Ortopedia",
    ativo: true,
  },
  {
    id: 4,
    nome: "Dra. Ana Costa",
    crm: "CRM/SP 456789",
    especialidade: "Clínica Geral",
    ativo: true,
  },
  {
    id: 5,
    nome: "Dr. Paulo Oliveira",
    crm: "CRM/SP 567890",
    especialidade: "Psiquiatria",
    ativo: true,
  },
  {
    id: 6,
    nome: "Dra. Carla Lima",
    crm: "CRM/SP 678901",
    especialidade: "Pediatria",
    ativo: true,
  },
];

/** Lista enxuta para selects */
export const medicosSelectMock = medicosMock.map((m) => ({
  id: m.id,
  nome: m.nome,
  especialidade: m.especialidade as Especialidade,
}));

export const consultasMock: Consulta[] = [
  {
    id: 1,
    pacienteId: 1,
    pacienteNome: "Carlos Andrade",
    medicoId: 1,
    medicoNome: "Dr. Roberto Silva",
    especialidade: "Cardiologia",
    data: "2026-03-10",
    horario: "09:00",
    status: "agendada",
    observacoes: "Consulta de rotina para acompanhamento cardíaco",
  },
  {
    id: 2,
    pacienteId: 1,
    pacienteNome: "Carlos Andrade",
    medicoId: 2,
    medicoNome: "Dra. Maria Santos",
    especialidade: "Dermatologia",
    data: "2026-03-12",
    horario: "14:30",
    status: "confirmada",
    observacoes: "Avaliação de manchas na pele",
  },
  {
    id: 3,
    pacienteId: 1,
    pacienteNome: "Carlos Andrade",
    medicoId: 3,
    medicoNome: "Dr. João Pereira",
    especialidade: "Ortopedia",
    data: "2026-03-15",
    horario: "10:00",
    status: "agendada",
  },
  {
    id: 4,
    pacienteId: 1,
    pacienteNome: "Carlos Andrade",
    medicoId: 4,
    medicoNome: "Dra. Ana Costa",
    especialidade: "Clínica Geral",
    data: "2026-02-28",
    horario: "11:00",
    status: "realizada",
    observacoes: "Consulta de check-up anual realizada com sucesso",
  },
  {
    id: 5,
    pacienteId: 1,
    pacienteNome: "Carlos Andrade",
    medicoId: 5,
    medicoNome: "Dr. Paulo Oliveira",
    especialidade: "Psiquiatria",
    data: "2026-02-25",
    horario: "16:00",
    status: "cancelada",
    observacoes: "Cancelada pelo paciente",
  },
];

let proximoId = consultasMock.length + 1;

export function gerarNovoId(): number {
  return proximoId++;
}

export function simularDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}