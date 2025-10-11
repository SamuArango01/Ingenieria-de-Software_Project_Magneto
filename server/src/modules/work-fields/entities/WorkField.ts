import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("work_fields")
export class WorkField {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    description: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
