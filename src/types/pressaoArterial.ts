/**
 * Tipos da feature de Pressão Arterial (simulação IoT)
 * Classificação baseada na Diretriz Brasileira de Hipertensão Arterial - 2025 (SBC/SBN/SBH)
 */

export type ClassificacaoPA =
    | "normal"
    | "pre_hipertensao"
    | "estagio_1"
    | "estagio_2"
    | "estagio_3";

export type ResultadoPressaoArterial = {
    sistolica: number;
    diastolica: number;
    classificacao: ClassificacaoPA;
    titulo: string;
    descricao: string;
    cor: string;
    ehEmergencia: boolean;
};

export type MedicaoPressaoArterial = {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    sistolica: number;
    diastolica: number;
    classificacao: ClassificacaoPA;
    dataHora: string;
    origem: "manual" | "iot_simulado";
    consultaEmergenciaId?: number;
};