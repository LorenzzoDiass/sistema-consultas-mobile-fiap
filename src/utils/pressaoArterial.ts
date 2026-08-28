/**
 * Classificação de Pressão Arterial
 * Referência clínica: Diretriz Brasileira de Hipertensão Arterial - 2025 (SBC/SBN/SBH)
 *
 * PA normal ........ PAS < 120 e PAD < 80
 * Pré-hipertensão .. PAS 120-139 e/ou PAD 80-89
 * HA Estágio 1 ..... PAS 140-159 e/ou PAD 90-99
 * HA Estágio 2 ..... PAS 160-179 e/ou PAD 100-109
 * HA Estágio 3 ..... PAS ≥ 180 e/ou PAD ≥ 110 ← emergência no app
 */

import {
    ClassificacaoPA,
    ResultadoPressaoArterial,
} from "../types/pressaoArterial";

export function classificarPressaoArterial(
    sistolica: number,
    diastolica: number
): ResultadoPressaoArterial {
    let classificacao: ClassificacaoPA;

    // Usa o nível mais elevado entre PAS e PAD
    if (sistolica >= 180 || diastolica >= 110) {
        classificacao = "estagio_3";
    } else if (sistolica >= 160 || diastolica >= 100) {
        classificacao = "estagio_2";
    } else if (sistolica >= 140 || diastolica >= 90) {
        classificacao = "estagio_1";
    } else if (sistolica >= 120 || diastolica >= 80) {
        classificacao = "pre_hipertensao";
    } else {
        classificacao = "normal";
    }

    const mapa: Record<
        ClassificacaoPA,
        Omit<
            ResultadoPressaoArterial,
            "sistolica" | "diastolica" | "classificacao"
        >
    > = {
        normal: {
            titulo: "PA Normal",
            descricao:
                "Pressão arterial dentro da faixa recomendada (< 120/80 mmHg).",
            cor: "#4CAF50",
            ehEmergencia: false,
        },

        pre_hipertensao: {
            titulo: "Pré-hipertensão",
            descricao:
                "Atenção: valores entre 120-139 e/ou 80-89 mmHg. Recomenda-se mudanças no estilo de vida e acompanhamento.",
            cor: "#FFC107",
            ehEmergencia: false,
        },

        estagio_1: {
            titulo: "Hipertensão Estágio 1",
            descricao:
                "PA elevada (140-159 e/ou 90-99 mmHg). Procure avaliação médica e monitoramento regular.",
            cor: "#FF9800",
            ehEmergencia: false,
        },

        estagio_2: {
            titulo: "Hipertensão Estágio 2",
            descricao:
                "PA muito elevada (160-179 e/ou 100-109 mmHg). Busque atendimento médico em breve.",
            cor: "#F44336",
            ehEmergencia: false,
        },

        estagio_3: {
            titulo: "🚨 Emergência Hipertensiva (Estágio 3)",
            descricao:
                "Valores críticos (PAS ≥ 180 e/ou PAD ≥ 110 mmHg). O sistema acionará consulta de emergência com Cardiologia.",
            cor: "#B71C1C",
            ehEmergencia: true,
        },
    };

    return {
        sistolica,
        diastolica,
        classificacao,
        ...mapa[classificacao],
    };
}

export function validarValoresPA(
    sistolica: number,
    diastolica: number
): string | null {
    if (!Number.isFinite(sistolica) || !Number.isFinite(diastolica)) {
        return "Informe valores numéricos válidos.";
    }

    if (sistolica < 70 || sistolica > 260) {
        return "Pressão sistólica fora da faixa aceitável (70 - 260 mmHg).";
    }

    if (diastolica < 40 || diastolica > 160) {
        return "Pressão diastólica fora da faixa aceitável (40 - 160 mmHg).";
    }

    if (diastolica >= sistolica) {
        return "A diastólica deve ser menor que a sistólica.";
    }

    return null;
}