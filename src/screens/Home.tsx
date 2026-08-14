/**
 * Home Screen - Tela Principal do Paciente
 * Exibe informações do usuário e acesso rápido às funcionalidades
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../contexts/AuthContext";

export default function Home({ navigation }: any) {
  const { usuario, logout } = useAuth();

  async function handleLogout() {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      
      <View style={styles.header}>
        <Text style={styles.icone}>👋</Text>
        <Text style={styles.titulo}>Olá, {usuario?.nome}!</Text>
        <Text style={styles.subtitulo}>O que deseja fazer hoje?</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: "#79059C" }]}
          onPress={() => navigation.navigate("MinhasConsultas")}
        >
          <Text style={styles.menuIcone}>📅</Text>
          <Text style={styles.menuTitulo}>Minhas Consultas</Text>
          <Text style={styles.menuDescricao}>Ver e gerenciar suas consultas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: "#4CAF50" }]}
          onPress={() => navigation.navigate("Agendamento")}
        >
          <Text style={styles.menuIcone}>➕</Text>
          <Text style={styles.menuTitulo}>Agendar Consulta</Text>
          <Text style={styles.menuDescricao}>Marcar nova consulta médica</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: "#FF9800" }]}
          onPress={() => navigation.navigate("ConsultasList")}
        >
          <Text style={styles.menuIcone}>📋</Text>
          <Text style={styles.menuTitulo}>Histórico</Text>
          <Text style={styles.menuDescricao}>Ver todas as suas consultas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>🚪 Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sistema de Consultas Médicas</Text>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#79059C",
    padding: 32,
    paddingTop: 48,
    alignItems: "center",
  },
  icone: {
    fontSize: 60,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  menuContainer: {
    padding: 20,
    gap: 16,
  },
  menuItem: {
    padding: 24,
    borderRadius: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  menuIcone: {
    fontSize: 40,
    marginBottom: 12,
  },
  menuTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  menuDescricao: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  logoutButton: {
    margin: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f44336",
    alignItems: "center",
  },
  logoutText: {
    color: "#f44336",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
  footerSubtext: {
    fontSize: 10,
    color: "#999",
  },
});
