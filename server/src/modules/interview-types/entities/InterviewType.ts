import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@/modules/users/entities/User";

@Entity("interview_types")
export class InterviewType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: "is_public", default: false })
    isPublic: boolean;

    @Column({ name: "created_by" })
    createdBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    creator: User;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
