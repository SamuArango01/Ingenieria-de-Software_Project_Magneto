import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Interview } from "@/modules/interviews/entities/Interview";

@Entity("interview_qa")
export class InterviewQA {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "interview_id" })
    interviewId: number;

    @ManyToOne(() => Interview)
    @JoinColumn({ name: "interview_id" })
    interview: Interview;

    @Column({ type: "text" })
    question: string;

    @Column({ type: "text", nullable: true })
    answer: string;

    @Column({ name: "question_order" })
    questionOrder: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
