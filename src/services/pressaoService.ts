import AsyncStorage from "@react-native-async-storage/async-storage";
import consultasService from "./consultasService";
import { Consulta } from "../interfaces/consulta";
import { MedicaoPressaoArterial } from "../types/pressaoArterial";
import { classificarPressaoArterial } from "../utils/pressaoArterial";

const STORAGE_KEY = "@medicoes_pressao";

export const CARDIOLOGISTA_EMERGENCIA = {
    id: 1,
    nome: "Dr. Roberto Silva",
    especialidade: "Cardiologia" as const,
};

class PressaoService {
    private async listarMedicoes(): Promise<MedicaoPressaoArterial[]> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch {
            return [];
        }
    }

    private async salvarMedicoes(
        medicoes: MedicaoPressaoArterial[]
    ): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medicoes));
    }

    async listarMedicoesDoPaciente(
        pacienteId: number
    ): Promise<MedicaoPressaoArterial[]> {
        const medicoes = await this.listarMedicoes();

        return medicoes
            .filter((m) => m.pacienteId === pacienteId)
            .sort((a, b) => b.dataHora.localeCompare(a.dataHora));
    }

    async registrarAfericao(params: {
        pacienteId: number;
        pacienteNome: string;
        sistolica: number;
        diastolica: number;
        origem?: "manual" | "iot_simulado";
    }): Promise<{
        medicao: MedicaoPressaoArterial;
        resultado: ReturnType<typeof classificarPressaoArterial>;
        consultaEmergencia?: Consulta;
    }> {
        const resultado = classificarPressaoArterial(
            params.sistolica,
            params.diastolica
        );

        let consultaEmergencia: Consulta | undefined;

        if (resultado.ehEmergencia) {
            const agora = new Date();
            const dataISO = agora.toISOString().slice(0, 10);

            const horario = `${String(agora.getHours()).padStart(2, "0")}:${String(
                agora.getMinutes()
            ).padStart(2, "0")}`;

            consultaEmergencia = await consultasService.criarConsulta({
                pacienteId: params.pacienteId,
                pacienteNome: params.pacienteNome,
                medicoId: CARDIOLOGISTA_EMERGENCIA.id,
                medicoNome: CARDIOLOGISTA_EMERGENCIA.nome,
                especialidade: CARDIOLOGISTA_EMERGENCIA.especialidade,
                usuarioId: params.pacienteId,
                data: dataISO,
                horario,
                status: "agendada",
                observacoes: `🚨 EMERGÊNCIA POR PRESSÃO ARTERIAL: ${params.sistolica}/${params.diastolica} mmHg (${resultado.titulo}). Aferição registrada pelo paciente (simulação IoT). Priorizar atendimento.`,
                prioridade: true,
                emergencia: true,
                pressaoSistolica: params.sistolica,
                pressaoDiastolica: params.diastolica,
                classificacaoPA: resultado.classificacao,
            });
        }

        const medicao: MedicaoPressaoArterial = {
            id: Date.now(),
            pacienteId: params.pacienteId,
            pacienteNome: params.pacienteNome,
            sistolica: params.sistolica,
            diastolica: params.diastolica,
            classificacao: resultado.classificacao,
            dataHora: new Date().toISOString(),
            origem: params.origem ?? "manual",
            consultaEmergenciaId: consultaEmergencia?.id,
        };

        const medicoes = await this.listarMedicoes();
        medicoes.push(medicao);
        await this.salvarMedicoes(medicoes);

        return { medicao, resultado, consultaEmergencia };
    }
}

export default new PressaoService();