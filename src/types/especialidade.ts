import { Especialidade } from "../types";

export interface Medico {
  id: number;
  nome: string;
  crm: string;
  especialidade: Especialidade;
  ativo: boolean;
}