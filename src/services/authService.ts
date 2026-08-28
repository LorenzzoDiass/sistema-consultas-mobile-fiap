/**
 * authService - Serviço de Autenticação
 * Gerencia usuários, login e inicialização de dados
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../types/usuario";
import { medicosMock } from "./mockData";

// Usuários iniciais do sistema (admin + pacientes + médicos)
const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: 1,
    nome: "Admin Sistema",
    email: "admin@sistema.com",
    senha: "admin123",
    cpf: "000.000.000-00",
    telefone: "(11) 99999-9999",
    perfil: "admin",
  },
  {
    id: 2,
    nome: "João Silva",
    email: "joao@email.com",
    senha: "123456",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    perfil: "paciente",
  },
  {
    id: 3,
    nome: "Maria Santos",
    email: "maria@email.com",
    senha: "123456",
    cpf: "987.654.321-00",
    telefone: "(11) 91234-5678",
    perfil: "paciente",
  },
  {
    id: 4,
    nome: "Pedro Oliveira",
    email: "pedro@email.com",
    senha: "123456",
    cpf: "456.789.123-00",
    telefone: "(11) 93456-7890",
    perfil: "paciente",
  },

  // Médicos de teste
  {
    id: 10,
    nome: "Dr. Roberto Silva",
    email: "roberto.silva@medico.com",
    senha: "123456",
    cpf: "111.111.111-11",
    telefone: "(11) 90000-0001",
    perfil: "medico",
    medicoId: 1,
    especialidade: "Cardiologia",
  },
  {
    id: 11,
    nome: "Dra. Maria Santos",
    email: "maria.santos@medico.com",
    senha: "123456",
    cpf: "222.222.222-22",
    telefone: "(11) 90000-0002",
    perfil: "medico",
    medicoId: 2,
    especialidade: "Dermatologia",
  },
  {
    id: 12,
    nome: "Dr. João Pereira",
    email: "joao.pereira@medico.com",
    senha: "123456",
    cpf: "333.333.333-33",
    telefone: "(11) 90000-0003",
    perfil: "medico",
    medicoId: 3,
    especialidade: "Ortopedia",
  },
  {
    id: 13,
    nome: "Dra. Ana Costa",
    email: "ana.costa@medico.com",
    senha: "123456",
    cpf: "444.444.444-44",
    telefone: "(11) 90000-0004",
    perfil: "medico",
    medicoId: 4,
    especialidade: "Clínica Geral",
  },
  {
    id: 14,
    nome: "Dr. Paulo Oliveira",
    email: "paulo.oliveira@medico.com",
    senha: "123456",
    cpf: "555.555.555-55",
    telefone: "(11) 90000-0005",
    perfil: "medico",
    medicoId: 5,
    especialidade: "Psiquiatria",
  },
  {
    id: 15,
    nome: "Dra. Carla Lima",
    email: "carla.lima@medico.com",
    senha: "123456",
    cpf: "666.666.666-66",
    telefone: "(11) 90000-0006",
    perfil: "medico",
    medicoId: 6,
    especialidade: "Pediatria",
  },
];

/**
 * Garante que os médicos de teste existam no AsyncStorage
 */
async function garantirMedicosDeTeste(
  usuarios: Usuario[]
): Promise<Usuario[]> {
  const medicosIniciais = USUARIOS_INICIAIS.filter(
    (u) => u.perfil === "medico"
  );

  let alterou = false;
  const atualizados = [...usuarios];

  for (const medico of medicosIniciais) {
    const jaExiste = atualizados.some(
      (u) => u.email === medico.email
    );

    if (!jaExiste) {
      atualizados.push(medico);
      alterou = true;
    }
  }

  // Alinha medicoId / especialidade caso o médico já exista
  for (let i = 0; i < atualizados.length; i++) {
    const usuario = atualizados[i];

    if (usuario.perfil !== "medico") {
      continue;
    }

    const referencia = medicosIniciais.find(
      (m) => m.email === usuario.email
    );

    if (
      referencia &&
      (usuario.medicoId !== referencia.medicoId ||
        usuario.especialidade !== referencia.especialidade)
    ) {
      atualizados[i] = {
        ...usuario,
        medicoId: referencia.medicoId,
        especialidade: referencia.especialidade,
        nome: referencia.nome,
      };

      alterou = true;
    }
  }

  if (alterou) {
    await AsyncStorage.setItem(
      "@usuarios",
      JSON.stringify(atualizados)
    );

    console.log("✅ Médicos de teste sincronizados");
  }

  return atualizados;
}

/**
 * Inicializa usuários no AsyncStorage se não existirem
 * e sincroniza médicos de teste quando necessário
 */
export async function inicializarUsuarios(): Promise<void> {
  try {
    const usuariosExistentes =
      await AsyncStorage.getItem("@usuarios");

    if (!usuariosExistentes) {
      await AsyncStorage.setItem(
        "@usuarios",
        JSON.stringify(USUARIOS_INICIAIS)
      );

      console.log(
        "✅ Usuários iniciais criados (admin, pacientes e médicos)"
      );

      return;
    }

    const usuarios: Usuario[] = JSON.parse(usuariosExistentes);

    await garantirMedicosDeTeste(usuarios);
  } catch (error) {
    console.error("❌ Erro ao inicializar usuários:", error);
  }
}

/**
 * Obtém todos os usuários cadastrados
 */
export async function obterUsuarios(): Promise<Usuario[]> {
  try {
    const usuariosJSON =
      await AsyncStorage.getItem("@usuarios");

    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return [];
  }
}

/**
 * Obtém usuário por ID
 */
export async function obterUsuarioPorId(
  id: number
): Promise<Usuario | null> {
  try {
    const usuarios = await obterUsuarios();

    return usuarios.find((u) => u.id === id) || null;
  } catch (error) {
    console.error("Erro ao obter usuário por ID:", error);
    return null;
  }
}

/**
 * Cadastra novo usuário
 */
export async function cadastrarUsuario(
  dadosUsuario: Omit<Usuario, "id" | "perfil">
): Promise<Usuario | null> {
  try {
    const usuarios = await obterUsuarios();

    const emailExiste = usuarios.some(
      (u) => u.email === dadosUsuario.email
    );

    if (emailExiste) {
      throw new Error("Email já cadastrado");
    }

    const novoUsuario: Usuario = {
      ...dadosUsuario,
      id: Date.now(),
      perfil: "paciente",
    };

    usuarios.push(novoUsuario);

    await AsyncStorage.setItem(
      "@usuarios",
      JSON.stringify(usuarios)
    );

    return novoUsuario;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return null;
  }
}

/**
 * Obtém credenciais de teste para exibir no Login
 */
export function obterCredenciaisTeste() {
  return {
    admin: {
      email: "admin@sistema.com",
      senha: "admin123",
    },

    pacientes: [
      {
        nome: "João Silva",
        email: "joao@email.com",
        senha: "123456",
      },
      {
        nome: "Maria Santos",
        email: "maria@email.com",
        senha: "123456",
      },
      {
        nome: "Pedro Oliveira",
        email: "pedro@email.com",
        senha: "123456",
      },
    ],

    medicos: medicosMock.map((medico) => {
      const usuario = USUARIOS_INICIAIS.find(
        (u) =>
          u.perfil === "medico" &&
          u.medicoId === medico.id
      );

      return {
        nome: medico.nome,
        especialidade: medico.especialidade,
        email: usuario?.email ?? "",
        senha: "123456",
      };
    }),
  };
}

/**
 * Força logout completo
 */
export async function forcarLogoutCompleto(): Promise<void> {
  try {
    console.log("🧹 Forçando logout completo...");

    const antes = await AsyncStorage.getItem("@usuario");

    console.log(
      "📦 ANTES:",
      antes ? "Usuário EXISTE" : "Nenhum usuário"
    );

    await AsyncStorage.removeItem("@usuario");

    console.log("🗑️ removeItem executado");

    await new Promise((resolve) =>
      setTimeout(resolve, 100)
    );

    const depois = await AsyncStorage.getItem("@usuario");

    console.log(
      "📦 DEPOIS:",
      depois ? "⚠️ AINDA EXISTE!" : "✅ REMOVIDO"
    );

    if (depois) {
      console.log("🚨 Usando multiRemove...");

      await AsyncStorage.multiRemove(["@usuario"]);

      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );

      const verificacaoFinal =
        await AsyncStorage.getItem("@usuario");

      console.log(
        "📦 FINAL:",
        verificacaoFinal ? "❌ FALHOU" : "✅ REMOVIDO"
      );
    }

    console.log("🎯 Logout completo concluído!");
  } catch (error) {
    console.error(
      "❌ Erro ao forçar logout completo:",
      error
    );
  }
}

/**
 * Limpa TUDO do AsyncStorage
 */
export async function limparTudoDoAsyncStorage(): Promise<void> {
  try {
    console.log(
      "🚨 LIMPANDO TUDO DO ASYNCSTORAGE..."
    );

    const todasChaves = await AsyncStorage.getAllKeys();

    console.log("🔑 Chaves encontradas:", todasChaves);

    await AsyncStorage.clear();

    console.log(
      "✅ AsyncStorage limpo completamente!"
    );

    console.log(
      "⚠️ VOCÊ PRECISARÁ RECARREGAR O APP!"
    );
  } catch (error) {
    console.error(
      "❌ Erro ao limpar AsyncStorage:",
      error
    );
  }
}

/**
 * Verifica se existe usuário logado no AsyncStorage
 */
export async function verificarUsuarioLogado(): Promise<Usuario | null> {
  try {
    const usuarioSalvo =
      await AsyncStorage.getItem("@usuario");

    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);

      console.log(
        "ℹ️ Usuário encontrado no AsyncStorage:",
        usuario.nome
      );

      return usuario;
    }

    console.log(
      "ℹ️ Nenhum usuário logado no AsyncStorage"
    );

    return null;
  } catch (error) {
    console.error(
      "❌ Erro ao verificar usuário logado:",
      error
    );

    return null;
  }
}