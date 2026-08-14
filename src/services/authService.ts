/**
 * authService - Serviço de Autenticação
 * Gerencia usuários, login e inicialização de dados
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../types/usuario";

// Usuários iniciais do sistema
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
];

/**
 * Inicializa usuários no AsyncStorage se não existirem
 */
export async function inicializarUsuarios(): Promise<void> {
  try {
    const usuariosExistentes = await AsyncStorage.getItem("@usuarios");
    
    if (!usuariosExistentes) {
      await AsyncStorage.setItem("@usuarios", JSON.stringify(USUARIOS_INICIAIS));
      console.log("✅ Usuários iniciais criados");
    }
  } catch (error) {
    console.error("❌ Erro ao inicializar usuários:", error);
  }
}

/**
 * Obtém todos os usuários cadastrados
 */
export async function obterUsuarios(): Promise<Usuario[]> {
  try {
    const usuariosJSON = await AsyncStorage.getItem("@usuarios");
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return [];
  }
}

/**
 * Obtém usuário por ID
 */
export async function obterUsuarioPorId(id: number): Promise<Usuario | null> {
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
    
    // Verifica se email já existe
    const emailExiste = usuarios.some((u) => u.email === dadosUsuario.email);
    if (emailExiste) {
      throw new Error("Email já cadastrado");
    }

    // Cria novo usuário
    const novoUsuario: Usuario = {
      ...dadosUsuario,
      id: usuarios.length + 1,
      perfil: "paciente", // Novos usuários sempre são pacientes
    };

    usuarios.push(novoUsuario);
    await AsyncStorage.setItem("@usuarios", JSON.stringify(usuarios));

    return novoUsuario;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return null;
  }
}

/**
 * Obtém credenciais de teste para exibir no Login (apenas desenvolvimento)
 */
export function obterCredenciaisTeste() {
  return {
    admin: {
      email: "admin@sistema.com",
      senha: "admin123",
    },
    pacientes: [
      { nome: "João Silva", email: "joao@email.com", senha: "123456" },
      { nome: "Maria Santos", email: "maria@email.com", senha: "123456" },
      { nome: "Pedro Oliveira", email: "pedro@email.com", senha: "123456" },
    ],
  };
}

/**
 * Força logout completo - remove TODOS os dados de autenticação
 * USE APENAS PARA DEBUG/TESTE
 */
export async function forcarLogoutCompleto(): Promise<void> {
  try {
    console.log("🧹 Forçando logout completo...");
    
    // Verifica antes
    const antes = await AsyncStorage.getItem("@usuario");
    console.log("📦 ANTES:", antes ? "Usuário EXISTE" : "Nenhum usuário");
    
    // Tenta remover
    await AsyncStorage.removeItem("@usuario");
    console.log("🗑️ removeItem executado");
    
    // Aguarda
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verifica depois
    const depois = await AsyncStorage.getItem("@usuario");
    console.log("📦 DEPOIS:", depois ? "⚠️ AINDA EXISTE!" : "✅ REMOVIDO");
    
    // Se ainda existe, usa multiRemove
    if (depois) {
      console.log("🚨 Usando multiRemove...");
      await AsyncStorage.multiRemove(["@usuario"]);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const verificacaoFinal = await AsyncStorage.getItem("@usuario");
      console.log("📦 FINAL:", verificacaoFinal ? "❌ FALHOU" : "✅ REMOVIDO");
    }
    
    console.log("🎯 Logout completo concluído!");
  } catch (error) {
    console.error("❌ Erro ao forçar logout completo:", error);
  }
}

/**
 * Limpa TUDO do AsyncStorage (CUIDADO!)
 */
export async function limparTudoDoAsyncStorage(): Promise<void> {
  try {
    console.log("🚨 LIMPANDO TUDO DO ASYNCSTORAGE...");
    const todasChaves = await AsyncStorage.getAllKeys();
    console.log("🔑 Chaves encontradas:", todasChaves);
    await AsyncStorage.clear();
    console.log("✅ AsyncStorage limpo completamente!");
    console.log("⚠️ VOCÊ PRECISARÁ RECARREGAR O APP!");
  } catch (error) {
    console.error("❌ Erro ao limpar AsyncStorage:", error);
  }
}

/**
 * Verifica se existe usuário logado no AsyncStorage
 */
export async function verificarUsuarioLogado(): Promise<Usuario | null> {
  try {
    const usuarioSalvo = await AsyncStorage.getItem("@usuario");
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      console.log("ℹ️ Usuário encontrado no AsyncStorage:", usuario.nome);
      return usuario;
    } else {
      console.log("ℹ️ Nenhum usuário logado no AsyncStorage");
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao verificar usuário logado:", error);
    return null;
  }
}
