import { AppDataSource } from "@/database/data-source";
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";
import { IInterviewTypeRepository } from "@/modules/interview-types/interfaces/IInterviewTypeRepository";
import { Repository } from "typeorm";

export class InterviewTypeRepository implements IInterviewTypeRepository {
    private repository: Repository<InterviewType>;

    constructor() {
        this.repository = AppDataSource.getRepository(InterviewType);
    }

    findAvailableForUser(userId: string): Promise<InterviewType[]> {
        return this.repository.createQueryBuilder("interview_type")
            .where("interview_type.is_active = :isActive", { isActive: true })
            .andWhere("(interview_type.is_public = :isPublic OR interview_type.created_by = :userId)", { isPublic: true, userId })
            .orderBy("interview_type.is_public", "DESC")
            .addOrderBy("interview_type.created_at", "DESC")
            .getMany();
    }

    findByIdForUser(userId: string, id: number): Promise<InterviewType | null> {
        return this.repository.createQueryBuilder("interview_type")
            .where("interview_type.id = :id", { id })
            .andWhere("(interview_type.is_public = :isPublic OR interview_type.created_by = :userId)", { isPublic: true, userId })
            .getOne();
    }

    save(interviewType: InterviewType): Promise<InterviewType> {
        return this.repository.save(interviewType);
    }

    find(options: any): Promise<InterviewType[]> {
        return this.repository.find(options);
    }

    findOne(options: any): Promise<InterviewType | null> {
        return this.repository.findOne(options);
    }

    create(interviewType: Partial<InterviewType>): InterviewType {
        return this.repository.create(interviewType);
    }
}
