import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { User } from "@/modules/users/entities/User";
import { WorkField } from "@/modules/work-fields/entities/WorkField";

@Entity("user_configuration")
export class UserConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", unique: true })
    userId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "work_field_id", nullable: true })
    workFieldId: number;

    @ManyToOne(() => WorkField)
    @JoinColumn({ name: "work_field_id" })
    workField: WorkField;

    @Column({ name: "custom_work_field", nullable: true })
    customWorkField: string;

    @Column({ name: "years_of_experience" })
    yearsOfExperience: number;

    @Column({ name: "preferred_language", default: "es" })
    preferredLanguage: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
