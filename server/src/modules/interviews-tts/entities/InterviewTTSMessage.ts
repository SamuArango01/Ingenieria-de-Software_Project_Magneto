import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { InterviewTTS } from "./InterviewTTS";

@Entity("interview_tts_messages")
export class InterviewTTSMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "interview_id" })
    interviewId: number;

    @ManyToOne(() => InterviewTTS)
    @JoinColumn({ name: "interview_id" })
    interview: InterviewTTS;

    @Column()
    role: string; // "user" or "ai"

    @Column({ type: "text" })
    message: string; // Transcribed text (user) or AI response text (ai)

    @Column({ name: "audio_duration_seconds", nullable: true })
    audioDurationSeconds: number; // Duration of audio message (if applicable)

    @Column({ name: "message_order" })
    messageOrder: number; // Sequential order in conversation

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
