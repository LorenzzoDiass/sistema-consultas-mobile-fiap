import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";
import pressaoService, {
    CARDIOLOGISTA_EMERGENCIA,
} from "../services/pressaoService";
import {
    classificarPressaoArterial,
    validarValoresPA,
} from "../utils/pressaoArterial";
import { ResultadoPressaoArterial } from "../types/pressaoArterial";

type PressaoArterialScreenProps = {
    navigation: any;
};

export default function PressaoArterialScreen({
    navigation,
}: PressaoArterialScreenProps) {
    const { usuario } = useAuth();

    const [sistolica, setSistolica] = useState("");
    const [diastolica, setDiastolica] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] =
        useState<ResultadoPressaoArterial | null>(null);

    async function handleRegistrar() {
        if (!usuario) {
            Alert.alert("Erro", "Faça login novamente.");
            return;
        }

        const pas = parseInt(sistolica, 10);
        const pad = parseInt(diastolica, 10);
        const erro = validarValoresPA(pas, pad);

        if (erro) {
            Alert.alert("Valores inválidos", erro);
            return;
        }

        setLoading(true);

        try {
            const { resultado: classificacao, consultaEmergencia } =
                await pressaoService.registrarAfericao({
                    pacienteId: usuario.id,
                    pacienteNome: usuario.nome,
                    sistolica: pas,
                    diastolica: pad,
                    origem: "manual",
                });

            setResultado(classificacao);

            if (consultaEmergencia) {
                Alert.alert(
                    "🚨 Emergência detectada",
                    `Sua pressão (${pas}/${pad} mmHg) indica gravidade.\n\nFoi agendada consulta PRIORITÁRIA com ${CARDIOLOGISTA_EMERGENCIA.nome} (Cardiologia).\n\nProcure atendimento imediatamente se houver sintomas (dor no peito, falta de ar, tontura intensa).`,
                    [
                        {
                            text: "Ver consultas",
                            onPress: () => navigation.navigate("ConsultasList"),
                        },
                        { text: "OK" },
                    ]
                );
            } else {
                Alert.alert(
                    classificacao.titulo,
                    `${pas}/${pad} mmHg\n\n${classificacao.descricao}`
                );
            }
        } catch (error: any) {
            Alert.alert(
                "Erro",
                error.message || "Não foi possível registrar a aferição."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleSimularPreview() {
        const pas = parseInt(sistolica, 10);
        const pad = parseInt(diastolica, 10);
        const erro = validarValoresPA(pas, pad);

        if (erro) {
            Alert.alert("Valores inválidos", erro);
            return;
        }

        setResultado(classificarPressaoArterial(pas, pad));
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <Text style={styles.icone}>🩺</Text>
                <Text style={styles.titulo}>Pressão Arterial</Text>
                <Text style={styles.subtitulo}>
                    Simulação de aferição (entrada manual - base IoT da aula)
                </Text>
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitulo}>Referência (DBHA 2025)</Text>
                <Text style={styles.cardInfoTexto}>Normal: &lt; 120 / &lt; 80</Text>
                <Text style={styles.cardInfoTexto}>
                    Pré-HA: 120 - 139 e/ou 80 - 89
                </Text>
                <Text style={styles.cardInfoTexto}>
                    Estágio 1: 140 - 159 e/ou 90 - 99
                </Text>
                <Text style={styles.cardInfoTexto}>
                    Estágio 2: 160 - 179 e/ou 100 - 109
                </Text>
                <Text style={[styles.cardInfoTexto, styles.destaque]}>
                    Estágio 3 (emergência): ≥ 180 e/ou ≥ 110
                </Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Pressão Sistólica (PAS) - mmHg *</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: 120"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={3}
                    value={sistolica}
                    onChangeText={setSistolica}
                    editable={!loading}
                />

                <Text style={styles.label}>Pressão Diastólica (PAD) - mmHg *</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: 80"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={3}
                    value={diastolica}
                    onChangeText={setDiastolica}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.botao, styles.botaoSecundario]}
                    onPress={handleSimularPreview}
                    disabled={loading}
                >
                    <Text style={styles.botaoTextoSecundario}>
                        Classificar (prévia)
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.botao, styles.botaoPrimario]}
                    onPress={handleRegistrar}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoTexto}>Registrar aferição</Text>
                    )}
                </TouchableOpacity>
            </View>

            {resultado && (
                <View
                    style={[
                        styles.resultado,
                        {
                            borderColor: resultado.cor,
                            backgroundColor: resultado.ehEmergencia ? "#FFEBEE" : "#fff",
                        },
                    ]}
                >
                    <Text style={[styles.resultadoTitulo, { color: resultado.cor }]}>
                        {resultado.titulo}
                    </Text>

                    <Text style={styles.resultadoValor}>
                        {resultado.sistolica}/{resultado.diastolica} mmHg
                    </Text>

                    <Text style={styles.resultadoDescricao}>
                        {resultado.descricao}
                    </Text>

                    {resultado.ehEmergencia && (
                        <Text style={styles.resultadoEmergencia}>
                            Consulta prioritária com {CARDIOLOGISTA_EMERGENCIA.nome} é
                            acionada automaticamente ao registrar a aferição.
                        </Text>
                    )}
                </View>
            )}

            <Text style={styles.aviso}>
                Esta tela é educacional e não substitui avaliação médica presencial.
                Em sintomas graves, procure emergência (SAMU 192).
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    icone: {
        fontSize: 56,
        marginBottom: 8,
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#79059C",
    },
    subtitulo: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 6,
    },
    cardInfo: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#79059C",
    },
    cardInfoTitulo: {
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    cardInfoTexto: {
        color: "#555",
        fontSize: 13,
        marginBottom: 2,
    },
    destaque: {
        color: "#B71C1C",
        fontWeight: "700",
        marginTop: 4,
    },
    form: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginTop: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 18,
        color: "#333",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    botao: {
        marginTop: 12,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    botaoPrimario: {
        backgroundColor: "#79059C",
    },
    botaoSecundario: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#79059C",
    },
    botaoTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    botaoTextoSecundario: {
        color: "#79059C",
        fontWeight: "bold",
        fontSize: 16,
    },
    resultado: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    resultadoTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    resultadoValor: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    resultadoDescricao: {
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
    resultadoEmergencia: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: "700",
        color: "#B71C1C",
    },
    aviso: {
        marginTop: 24,
        fontSize: 12,
        color: "#888",
        textAlign: "center",
        lineHeight: 18,
    },
});