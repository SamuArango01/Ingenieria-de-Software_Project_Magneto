import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@/modules/users/entities/User";
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";

@Entity("interviews")
export class Interview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id" })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "interview_type_id", nullable: true })
    interviewTypeId: number | null;

    @ManyToOne(() => InterviewType)
    @JoinColumn({ name: "interview_type_id" })
    interviewType: InterviewType;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    score: number;

    @Column({ name: "duration_minutes", nullable: true })
    durationMinutes: number;

    @Column({ default: "in_progress" })
    status: string;

    @CreateDateColumn({ name: "started_at" })
    startedAt: Date;

    @Column({ name: "completed_at", nullable: true })
    completedAt: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
