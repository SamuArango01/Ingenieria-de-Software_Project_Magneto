import { AppDataSource } from "@/database/data-source";
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";

export const interviewTypeRepository = AppDataSource.getRepository(InterviewType).extend({
    async findAvailableForUser(userId: string): Promise<InterviewType[]> {
        return this.createQueryBuilder("interview_type")
            .where("interview_type.is_active = :isActive", { isActive: true })
            .andWhere("(interview_type.is_public = :isPublic OR interview_type.created_by = :userId)", { isPublic: true, userId })
            .orderBy("interview_type.is_public", "DESC")
            .addOrderBy("interview_type.created_at", "DESC")
            .getMany();
    }
});
