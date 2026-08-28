import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MedicoHomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { usuario, logout } = useAuth();

    async function handleLogout() {
        await logout();
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.saudacao}>Olá,</Text>
                    <Text style={styles.nome}>{usuario?.nome}</Text>

                    {usuario?.especialidade && (
                        <Text style={styles.especialidade}>
                            {usuario.especialidade}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.botaoSair}
                    onPress={handleLogout}
                >
                    <Text style={styles.textoSair}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.conteudo}>
                <Text style={styles.titulo}>Área do Médico</Text>

                <Text style={styles.subtitulo}>
                    Acesse sua agenda e acompanhe suas consultas.
                </Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("ConsultasList")}
                >
                    <Text style={styles.icone}>📅</Text>

                    <View style={styles.cardConteudo}>
                        <Text style={styles.cardTitulo}>Minha Agenda</Text>

                        <Text style={styles.cardDescricao}>
                            Visualize as consultas atribuídas a você
                        </Text>
                    </View>

                    <Text style={styles.seta}>›</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },

    header: {
        backgroundColor: "#007AFF",
        padding: 24,
        paddingTop: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    saudacao: {
        color: "#ffffff",
        fontSize: 16,
    },

    nome: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 4,
    },

    especialidade: {
        color: "#e6f2ff",
        fontSize: 15,
        marginTop: 4,
    },

    botaoSair: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },

    textoSair: {
        color: "#ffffff",
        fontWeight: "bold",
    },

    conteudo: {
        padding: 20,
    },

    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 6,
    },

    subtitulo: {
        fontSize: 15,
        color: "#666666",
        marginBottom: 24,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    icone: {
        fontSize: 32,
        marginRight: 16,
    },

    cardConteudo: {
        flex: 1,
    },

    cardTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 4,
    },

    cardDescricao: {
        fontSize: 14,
        color: "#666666",
    },

    seta: {
        fontSize: 32,
        color: "#999999",
    },
});