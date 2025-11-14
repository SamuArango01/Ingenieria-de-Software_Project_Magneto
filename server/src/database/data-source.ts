import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/modules/users/entities/User";
import { WorkField } from "@/modules/work-fields/entities/WorkField";
import { UserConfiguration } from "@/modules/user-configurations/entities/UserConfiguration";
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";
import { Interview } from "@/modules/interviews/entities/Interview";
import { InterviewEvaluation } from "@/modules/interview-evaluations/entities/InterviewEvaluation";
import { InterviewQA } from "@/modules/interview-qa/entities/InterviewQA";
import { UserRole } from "@/modules/roles/entities/UserRole";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Set to false in production
    logging: false,
    entities: [
        User,
        WorkField,
        UserConfiguration,
        InterviewType,
        Interview,
        InterviewEvaluation,
        InterviewQA,
        UserRole
    ],
    migrations: [],
    subscribers: [],
});
