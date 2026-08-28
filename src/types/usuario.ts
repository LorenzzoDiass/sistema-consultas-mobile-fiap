/**
 * Tipos relacionados a Usuários
 */

export type TipoUsuario = "paciente" | "medico" | "admin";

export type EspecialidadeUsuario =
  | "Cardiologia"
  | "Dermatologia"
  | "Ortopedia"
  | "Pediatria"
  | "Psiquiatria"
  | "Clínica Geral";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string; // Opcional pois removemos após login
  cpf: string;
  telefone: string;
  perfil: TipoUsuario;

  /** Presente quando perfil === "medico" - liga o usuário às consultas */
  medicoId?: number;
  especialidade?: EspecialidadeUsuario;
}

// Credenciais fixas para admin (em produção seria em backend)
export const ADMIN_CREDENTIALS = {
  email: "admin@sistema.com",
  senha: "admin123",
};