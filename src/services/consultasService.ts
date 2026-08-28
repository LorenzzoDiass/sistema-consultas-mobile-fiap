/**
 * Consultas Service
 * Gerencia operações relacionadas a consultas com AsyncStorage
 * Filtra consultas baseado no perfil do usuário logado
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Consulta } from "../interfaces/consulta";

/**
 * Opções usadas para controlar o acesso às consultas
 */
export type OpcoesFiltroConsulta = {
  usuarioId?: number;
  isAdmin?: boolean;
  isMedico?: boolean;
  medicoId?: number;
};

class ConsultasService {
  /**
   * Obtém todas as consultas do AsyncStorage
   */
  private async obterTodasConsultas(): Promise<Consulta[]> {
    try {
      const consultasJSON = await AsyncStorage.getItem("@consultas");

      if (!consultasJSON) {
        return [];
      }

      const consultas: Consulta[] = JSON.parse(consultasJSON);

      return consultas;
    } catch (error) {
      console.error("Erro ao obter consultas:", error);
      return [];
    }
  }

  /**
   * Salva consultas no AsyncStorage
   */
  private async salvarConsultas(
    consultas: Consulta[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "@consultas",
        JSON.stringify(consultas)
      );
    } catch (error) {
      console.error("Erro ao salvar consultas:", error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário tem permissão para acessar
   * determinada consulta
   */
  private temPermissao(
    consulta: Consulta,
    opcoes: OpcoesFiltroConsulta
  ): boolean {
    // Admin pode acessar qualquer consulta
    if (opcoes.isAdmin) {
      return true;
    }

    // Médico pode acessar somente consultas atribuídas a ele
    if (opcoes.isMedico && opcoes.medicoId) {
      return consulta.medicoId === opcoes.medicoId;
    }

    // Paciente pode acessar somente as próprias consultas
    if (opcoes.usuarioId) {
      return consulta.usuarioId === opcoes.usuarioId;
    }

    return false;
  }

  /**
   * Lista consultas de acordo com o perfil:
   *
   * Admin -> todas
   * Médico -> consultas atribuídas ao medicoId
   * Paciente -> consultas do usuarioId
   */
  async listarConsultas(
    usuarioId?: number,
    isAdmin: boolean = false,
    isMedico: boolean = false,
    medicoId?: number
  ): Promise<Consulta[]> {
    const todasConsultas = await this.obterTodasConsultas();

    // Admin vê tudo
    if (isAdmin) {
      return todasConsultas;
    }

    // Médico vê apenas a própria agenda
    if (isMedico && medicoId) {
      return todasConsultas.filter(
        (consulta) => consulta.medicoId === medicoId
      );
    }

    // Paciente vê apenas suas consultas
    if (usuarioId) {
      return todasConsultas.filter(
        (consulta) => consulta.usuarioId === usuarioId
      );
    }

    return [];
  }

  /**
   * Obtém uma consulta específica por ID
   */
  async obterConsulta(
    id: number,
    usuarioId?: number,
    isAdmin: boolean = false,
    isMedico: boolean = false,
    medicoId?: number
  ): Promise<Consulta> {
    const todasConsultas = await this.obterTodasConsultas();

    const consulta = todasConsultas.find(
      (c) => c.id === id
    );

    if (!consulta) {
      throw new Error("Consulta não encontrada");
    }

    const permitido = this.temPermissao(consulta, {
      usuarioId,
      isAdmin,
      isMedico,
      medicoId,
    });

    if (!permitido) {
      throw new Error(
        "Você não tem permissão para visualizar esta consulta"
      );
    }

    return consulta;
  }

  /**
   * Cria uma nova consulta
   *
   * Mantém todos os campos recebidos, inclusive os campos
   * da funcionalidade de pressão arterial/emergência.
   */
  async criarConsulta(
    consultaData: Omit<Consulta, "id">
  ): Promise<Consulta> {
    const todasConsultas = await this.obterTodasConsultas();

    const novaConsulta: Consulta = {
      ...consultaData,
      id: Date.now(),
    };

    todasConsultas.push(novaConsulta);

    await this.salvarConsultas(todasConsultas);

    return novaConsulta;
  }

  /**
   * Atualiza o status para "confirmada"
   */
  async confirmarConsulta(
    id: number,
    usuarioId?: number,
    isAdmin: boolean = false,
    isMedico: boolean = false,
    medicoId?: number
  ): Promise<Consulta> {
    const todasConsultas = await this.obterTodasConsultas();

    const index = todasConsultas.findIndex(
      (c) => c.id === id
    );

    if (index === -1) {
      throw new Error("Consulta não encontrada");
    }

    const consulta = todasConsultas[index];

    const permitido = this.temPermissao(consulta, {
      usuarioId,
      isAdmin,
      isMedico,
      medicoId,
    });

    if (!permitido) {
      throw new Error(
        "Você não tem permissão para modificar esta consulta"
      );
    }

    if (consulta.status !== "agendada") {
      throw new Error(
        "Apenas consultas agendadas podem ser confirmadas"
      );
    }

    todasConsultas[index] = {
      ...consulta,
      status: "confirmada",
    };

    await this.salvarConsultas(todasConsultas);

    return todasConsultas[index];
  }

  /**
   * Atualiza o status para "cancelada"
   */
  async cancelarConsulta(
    id: number,
    usuarioId?: number,
    isAdmin: boolean = false,
    isMedico: boolean = false,
    medicoId?: number
  ): Promise<Consulta> {
    const todasConsultas = await this.obterTodasConsultas();

    const index = todasConsultas.findIndex(
      (c) => c.id === id
    );

    if (index === -1) {
      throw new Error("Consulta não encontrada");
    }

    const consulta = todasConsultas[index];

    const permitido = this.temPermissao(consulta, {
      usuarioId,
      isAdmin,
      isMedico,
      medicoId,
    });

    if (!permitido) {
      throw new Error(
        "Você não tem permissão para modificar esta consulta"
      );
    }

    if (
      consulta.status !== "agendada" &&
      consulta.status !== "confirmada"
    ) {
      throw new Error(
        "Apenas consultas agendadas ou confirmadas podem ser canceladas"
      );
    }

    todasConsultas[index] = {
      ...consulta,
      status: "cancelada",
    };

    await this.salvarConsultas(todasConsultas);

    return todasConsultas[index];
  }

  /**
   * Atualiza o status para "realizada"
   * Apenas admin
   */
  async realizarConsulta(
    id: number,
    isAdmin: boolean = false
  ): Promise<Consulta> {
    if (!isAdmin) {
      throw new Error(
        "Apenas administradores podem marcar consultas como realizadas"
      );
    }

    const todasConsultas = await this.obterTodasConsultas();

    const index = todasConsultas.findIndex(
      (c) => c.id === id
    );

    if (index === -1) {
      throw new Error("Consulta não encontrada");
    }

    if (todasConsultas[index].status !== "confirmada") {
      throw new Error(
        "Apenas consultas confirmadas podem ser realizadas"
      );
    }

    todasConsultas[index] = {
      ...todasConsultas[index],
      status: "realizada",
    };

    await this.salvarConsultas(todasConsultas);

    return todasConsultas[index];
  }

  /**
   * Deleta uma consulta
   * Apenas admin
   */
  async deletarConsulta(
    id: number,
    isAdmin: boolean = false
  ): Promise<void> {
    if (!isAdmin) {
      throw new Error(
        "Apenas administradores podem deletar consultas"
      );
    }

    const todasConsultas = await this.obterTodasConsultas();

    const consultasFiltradas = todasConsultas.filter(
      (c) => c.id !== id
    );

    await this.salvarConsultas(consultasFiltradas);
  }
}

/**
 * Consultas iniciais
 *
 * medicoId e medicoNome estão alinhados com medicosMock.
 */
const CONSULTAS_INICIAIS: Consulta[] = [
  {
    id: 1,
    pacienteId: 2,
    pacienteNome: "João Silva",
    medicoId: 1,
    medicoNome: "Dr. Roberto Silva",
    especialidade: "Cardiologia",
    usuarioId: 2,
    data: "2026-04-25",
    horario: "14:00",
    status: "agendada",
    observacoes: "Consulta de rotina",
    valor: 250,
  },
  {
    id: 2,
    pacienteId: 2,
    pacienteNome: "João Silva",
    medicoId: 2,
    medicoNome: "Dra. Maria Santos",
    especialidade: "Dermatologia",
    usuarioId: 2,
    data: "2026-04-28",
    horario: "10:30",
    status: "confirmada",
    observacoes: "Avaliação dermatológica",
    valor: 300,
  },
  {
    id: 3,
    pacienteId: 3,
    pacienteNome: "Maria Santos",
    medicoId: 3,
    medicoNome: "Dr. João Pereira",
    especialidade: "Ortopedia",
    usuarioId: 3,
    data: "2026-04-30",
    horario: "09:00",
    status: "agendada",
    observacoes: "Dor no joelho",
    valor: 200,
  },
  {
    id: 4,
    pacienteId: 3,
    pacienteNome: "Maria Santos",
    medicoId: 4,
    medicoNome: "Dra. Ana Costa",
    especialidade: "Clínica Geral",
    usuarioId: 3,
    data: "2026-05-05",
    horario: "15:00",
    status: "confirmada",
    observacoes: "Consulta preventiva",
    valor: 280,
  },
  {
    id: 5,
    pacienteId: 2,
    pacienteNome: "João Silva",
    medicoId: 5,
    medicoNome: "Dr. Paulo Oliveira",
    especialidade: "Psiquiatria",
    usuarioId: 2,
    data: "2026-04-20",
    horario: "11:00",
    status: "realizada",
    observacoes: "Consulta de acompanhamento",
    valor: 350,
  },
];

/**
 * Inicializa consultas no AsyncStorage se não existirem
 */
export async function inicializarConsultas(): Promise<void> {
  try {
    const consultasExistentes =
      await AsyncStorage.getItem("@consultas");

    if (!consultasExistentes) {
      await AsyncStorage.setItem(
        "@consultas",
        JSON.stringify(CONSULTAS_INICIAIS)
      );

      console.log("✅ Consultas iniciais criadas");
    }
  } catch (error) {
    console.error(
      "❌ Erro ao inicializar consultas:",
      error
    );
  }
}

export default new ConsultasService();