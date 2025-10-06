import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { WorkField } from "../models/WorkField";
import { UserConfiguration } from "../models/UserConfiguration";
import { InterviewType } from "../models/InterviewType";
import { Interview } from "../models/Interview";
import { InterviewEvaluation } from "../models/InterviewEvaluation";
import { InterviewQA } from "../models/InterviewQA";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Set to false in production
    logging: false,
    entities: [User, WorkField, UserConfiguration, InterviewType, Interview, InterviewEvaluation, InterviewQA],
    migrations: [],
    subscribers: [],
})
