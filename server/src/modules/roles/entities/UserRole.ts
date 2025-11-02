import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/User";

export enum RoleType {
  CANDIDATE = "candidate",
  RECRUITER = "recruiter"
}

@Entity("user_roles")
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "varchar",
    length: 20,
    default: RoleType.CANDIDATE
  })
  role: RoleType;

  @CreateDateColumn({ name: "assigned_at" })
  assignedAt: Date;
}
