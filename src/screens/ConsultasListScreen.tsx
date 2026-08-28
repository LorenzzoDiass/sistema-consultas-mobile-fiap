/**
 * ConsultasListScreen - Lista de Consultas
 * Exibe consultas de acordo com o perfil:
 * Admin -> todas
 * Médico -> somente as consultas atribuídas a ele
 * Paciente -> somente suas consultas
 */

import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import consultasService from "../services/consultasService";
import { Consulta } from "../interfaces/consulta";
import { StatusConsulta } from "../types/statusConsulta";
import { ConsultaCard, Loading, EmptyState } from "../components";

type ConsultasListScreenProps = {
  navigation: any;
};

export default function ConsultasListScreen({
  navigation,
}: ConsultasListScreenProps) {
  const { usuario, isAdmin, isMedico } = useAuth();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filtroAtivo, setFiltroAtivo] =
    useState<StatusConsulta | "todas">("todas");

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [usuario?.id, usuario?.medicoId])
  );

  async function carregarConsultas() {
    setLoading(true);

    try {
      const dados = await consultasService.listarConsultas(
        usuario?.id,
        isAdmin(),
        isMedico(),
        usuario?.medicoId
      );

      setConsultas(dados);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar as consultas"
      );
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);

    await carregarConsultas();

    setRefreshing(false);
  }

  async function handleConfirmar(id: number) {
    try {
      await consultasService.confirmarConsulta(
        id,
        usuario?.id,
        isAdmin(),
        isMedico(),
        usuario?.medicoId
      );

      Alert.alert("Sucesso", "Consulta confirmada!");

      carregarConsultas();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Erro ao confirmar consulta"
      );
    }
  }

  async function handleCancelar(id: number) {
    Alert.alert(
      "Cancelar Consulta",
      "Deseja realmente cancelar esta consulta?",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await consultasService.cancelarConsulta(
                id,
                usuario?.id,
                isAdmin(),
                isMedico(),
                usuario?.medicoId
              );

              Alert.alert(
                "Sucesso",
                "Consulta cancelada"
              );

              carregarConsultas();
            } catch (error: any) {
              Alert.alert(
                "Erro",
                error.message ||
                "Erro ao cancelar consulta"
              );
            }
          },
        },
      ]
    );
  }

  function handleDetalhes(id: number) {
    navigation.navigate("ConsultaDetalhes", {
      consultaId: id,
    });
  }

  const consultasFiltradas = (
    filtroAtivo === "todas"
      ? consultas
      : consultas.filter(
        (c) => c.status === filtroAtivo
      )
  )
    .slice()
    .sort((a, b) => {
      // Consultas de emergência/prioritárias aparecem primeiro
      const prioridadeA =
        a.prioridade || a.emergencia ? 1 : 0;

      const prioridadeB =
        b.prioridade || b.emergencia ? 1 : 0;

      return prioridadeB - prioridadeA;
    });

  function obterTitulo() {
    if (isAdmin()) {
      return "📋 Todas as Consultas";
    }

    if (isMedico()) {
      return "🩺 Minha Agenda";
    }

    return "📋 Minhas Consultas";
  }

  function obterSubtitulo() {
    if (isMedico()) {
      return `${usuario?.nome} • ${usuario?.especialidade}`;
    }

    return `${consultasFiltradas.length} consulta(s) encontrada(s)`;
  }

  function obterMensagemVazia() {
    if (filtroAtivo !== "todas") {
      return `Nenhuma consulta ${filtroAtivo}`;
    }

    if (isMedico()) {
      return `Nenhuma consulta para o médico ${usuario?.nome}`;
    }

    return "Nenhuma consulta encontrada";
  }

  if (loading) {
    return (
      <Loading mensagem="Carregando consultas..." />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {obterTitulo()}
        </Text>

        <Text style={styles.headerSubtitle}>
          {obterSubtitulo()}
        </Text>

        {isMedico() && (
          <Text style={styles.quantidadeConsultas}>
            {consultasFiltradas.length} consulta(s)
          </Text>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[
            styles.filtro,
            filtroAtivo === "todas" &&
            styles.filtroAtivo,
          ]}
          onPress={() => setFiltroAtivo("todas")}
        >
          <Text
            style={[
              styles.filtroTexto,
              filtroAtivo === "todas" &&
              styles.filtroTextoAtivo,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filtro,
            filtroAtivo === "agendada" &&
            styles.filtroAtivo,
          ]}
          onPress={() =>
            setFiltroAtivo("agendada")
          }
        >
          <Text
            style={[
              styles.filtroTexto,
              filtroAtivo === "agendada" &&
              styles.filtroTextoAtivo,
            ]}
          >
            Agendadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filtro,
            filtroAtivo === "confirmada" &&
            styles.filtroAtivo,
          ]}
          onPress={() =>
            setFiltroAtivo("confirmada")
          }
        >
          <Text
            style={[
              styles.filtroTexto,
              filtroAtivo === "confirmada" &&
              styles.filtroTextoAtivo,
            ]}
          >
            Confirmadas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Consultas */}
      {consultasFiltradas.length === 0 ? (
        <EmptyState
          icone="📅"
          mensagem={obterMensagemVazia()}
        />
      ) : (
        <FlatList
          data={consultasFiltradas}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <ConsultaCard
              consulta={item}
              onConfirmar={() =>
                handleConfirmar(item.id)
              }
              onCancelar={() =>
                handleCancelar(item.id)
              }
              onDetalhes={() =>
                handleDetalhes(item.id)
              }
            />
          )}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },

  quantidadeConsultas: {
    fontSize: 13,
    color: "#79059C",
    fontWeight: "600",
    marginTop: 4,
  },

  filtros: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  filtro: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  filtroAtivo: {
    backgroundColor: "#79059C",
    borderColor: "#79059C",
  },

  filtroTexto: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },

  filtroTextoAtivo: {
    color: "#fff",
  },

  lista: {
    padding: 16,
  },
});