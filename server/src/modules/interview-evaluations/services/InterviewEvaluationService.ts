import { ok, err, Result, fromPromise } from "neverthrow"; // Importar fromPromise
import type { IInterviewEvaluationRepository } from "@/modules/interview-evaluations/interfaces/IInterviewEvaluationRepository";
import { InterviewEvaluationRepository } from "@/modules/interview-evaluations/repositories/InterviewEvaluationRepository";
import type { IInterviewEvaluationService, CreateEvaluationError } from "@/modules/interview-evaluations/interfaces/IInterviewEvaluationService";
import { InterviewEvaluation } from "@/modules/interview-evaluations/entities/InterviewEvaluation";

export class InterviewEvaluationService implements IInterviewEvaluationService {
    private evaluationRepository: IInterviewEvaluationRepository;

    constructor(evaluationRepository: IInterviewEvaluationRepository = new InterviewEvaluationRepository()) {
        this.evaluationRepository = evaluationRepository;
    }

    async createEvaluation(data: { feedback: string; interviewId: number; rating?: number }): Promise<Result<InterviewEvaluation, CreateEvaluationError>> {
        // 1. Validación de la lógica de negocio
        if (!data.feedback) {
            return err({ type: 'ValidationError', message: 'El feedback no puede estar vacío.' });
        }
        if (!data.interviewId) {
            return err({ type: 'ValidationError', message: 'Se requiere el ID de la entrevista.' });
        }

        // 2. Creación de la entidad en memoria
        const evaluationData = this.evaluationRepository.create(data);

        // 3. Uso de fromPromise para manejar el guardado
        return fromPromise( 
            this.evaluationRepository.save(evaluationData),
            (error) => ({ type: 'DatabaseError', cause: error as Error })
        );
    }
}