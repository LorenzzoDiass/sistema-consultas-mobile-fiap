/**
 * AuthContext - Contexto de Autenticação
 * Gerencia o estado de autenticação do usuário em todo o app
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../types/usuario";

type AuthContextData = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("🔄 AuthProvider renderizado - Usuario atual:", usuario?.nome || "nenhum");

  // Carrega usuário salvo ao iniciar o app
  useEffect(() => {
    carregarUsuario();
  }, []);

  // Monitora mudanças no estado do usuario
  useEffect(() => {
    console.log("🔔 Estado 'usuario' mudou:", usuario ? `${usuario.nome} (${usuario.perfil})` : "null");
  }, [usuario]);

  async function carregarUsuario() {
    try {
      console.log("🔍 Verificando usuário salvo no AsyncStorage...");
      const usuarioSalvo = await AsyncStorage.getItem("@usuario");
      if (usuarioSalvo) {
        const usuarioParseado = JSON.parse(usuarioSalvo);
        setUsuario(usuarioParseado);
        console.log("✅ Usuário carregado:", usuarioParseado.nome);
      } else {
        console.log("ℹ️ Nenhum usuário salvo encontrado");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, senha: string): Promise<boolean> {
    try {
      console.log("🔑 Tentando login com email:", email);
      
      // Busca usuários cadastrados
      const usuariosJSON = await AsyncStorage.getItem("@usuarios");
      const usuarios: Usuario[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];
      console.log(`📋 ${usuarios.length} usuários encontrados no sistema`);

      // Busca usuário por email e senha
      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (usuarioEncontrado) {
        console.log("✅ Credenciais válidas para:", usuarioEncontrado.nome);
        
        // Remove senha antes de salvar no contexto (segurança)
        const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;
        const usuarioParaSalvar = usuarioSemSenha as Usuario;

        // Salva no AsyncStorage PRIMEIRO
        await AsyncStorage.setItem("@usuario", JSON.stringify(usuarioParaSalvar));
        console.log("💾 Usuário salvo no AsyncStorage");
        
        // Atualiza estado do contexto
        setUsuario(usuarioParaSalvar);
        console.log("🎯 Login concluído com sucesso!");
        return true;
      }

      console.log("❌ Credenciais inválidas");
      return false;
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      return false;
    }
  }

  async function logout() {
    try {
      console.log("🚪 Iniciando logout...");
      console.log("🔍 Usuário atual antes do logout:", usuario?.nome, usuario?.perfil);
      
      // 1. Verifica se existe antes de remover
      const usuarioAntes = await AsyncStorage.getItem("@usuario");
      console.log("📦 @usuario ANTES da remoção:", usuarioAntes ? "EXISTE" : "NÃO EXISTE");
      
      // 2. Remove do AsyncStorage - MÚLTIPLAS TENTATIVAS
      console.log("🗑️ Removendo @usuario do AsyncStorage...");
      await AsyncStorage.removeItem("@usuario");
      
      // 3. Aguarda um pouco para garantir que foi removido
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 4. VERIFICA se realmente foi removido
      const usuarioDepois = await AsyncStorage.getItem("@usuario");
      console.log("📦 @usuario DEPOIS da remoção:", usuarioDepois ? "⚠️ AINDA EXISTE!" : "✅ REMOVIDO");
      
      // 5. Se ainda existe, tenta remover novamente com força
      if (usuarioDepois) {
        console.log("⚠️ TENTANDO REMOVER NOVAMENTE...");
        await AsyncStorage.removeItem("@usuario");
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const verificacaoFinal = await AsyncStorage.getItem("@usuario");
        console.log("📦 Verificação FINAL:", verificacaoFinal ? "❌ FALHOU - AINDA EXISTE" : "✅ REMOVIDO");
        
        // Última tentativa: limpar TODAS as chaves (emergência)
        if (verificacaoFinal) {
          console.log("🚨 EMERGÊNCIA: Tentando AsyncStorage.clear()...");
          const allKeys = await AsyncStorage.getAllKeys();
          console.log("🔑 Todas as chaves:", allKeys);
          await AsyncStorage.multiRemove(["@usuario"]);
          console.log("✅ multiRemove executado");
        }
      }
      
      // 6. Limpa estado do contexto
      setUsuario(null);
      console.log("✅ Estado do contexto limpo");
      console.log("🎯 Logout concluído!");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
      // Mesmo com erro, tenta limpar o estado
      setUsuario(null);
    }
  }

  function isAdmin(): boolean {
    return usuario?.perfil === "admin";
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
