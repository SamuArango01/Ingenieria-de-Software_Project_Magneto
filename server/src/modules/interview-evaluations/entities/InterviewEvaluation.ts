// src/modules/interview-evaluations/entities/InterviewEvaluation.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Interview } from "@/modules/interviews/entities/Interview";

@Entity("interview_evaluations")
export class InterviewEvaluation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "interview_id" })
    interviewId: number;

    @ManyToOne(() => Interview)
    @JoinColumn({ name: "interview_id" })
    interview: Interview;

    @Column({ name: "areas_to_improve", type: "text" })
    areasToImprove: string;

    @Column({ type: "text", nullable: true })
    strengths: string | null; // ✅ Permitir string o null

    @Column({ name: "ai_feedback", type: "text", nullable: true })
    aiFeedback: string | null; // ✅ Permitir string o null

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    constructor(data?: Partial<InterviewEvaluation>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}