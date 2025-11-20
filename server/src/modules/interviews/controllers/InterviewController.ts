// src/modules/interviews/controllers/InterviewController.ts
import type { Request, Response } from 'express';
import type { IInterviewService } from '@/modules/interviews/interfaces/IInterviewService';
import { getAuth } from '@clerk/express';
import multer from 'multer';
import fs from 'fs';

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
});

export class InterviewController {
    private interviewService: IInterviewService;

    constructor(interviewService: IInterviewService) {
        this.interviewService = interviewService;
    }

    async startStarInterview(req: Request, res: Response): Promise<void> {
        try {
            const { userId: clerkUserId } = getAuth(req);
            if (!clerkUserId) {
                res.status(401).json({ 
                    success: false,
                    message: 'Unauthorized' 
                });
                return;
            }

            const { candidateName, interviewTypeId, difficultyLevel = 'junior' } = req.body;

            if (!candidateName) {
                res.status(400).json({
                    success: false,
                    message: 'El nombre del candidato es requerido'
                });
                return;
            }

            const result = await this.interviewService.startStarInterview(
                candidateName,
                clerkUserId,
                interviewTypeId ? Number(interviewTypeId) : undefined,
                difficultyLevel
            );

            result.match(
                (data) => {
                    res.json({
                        success: true,
                        data: {
                            initialMessage: data.initialMessage,
                            interviewId: data.interviewId,
                            candidateName: candidateName,
                            timestamp: new Date().toISOString()
                        }
                    });
                },
                (error) => {
                    console.error("Error en startStarInterview:", error);
                    if (error.type === 'ValidationError') {
                        res.status(400).json({
                            success: false,
                            message: error.message
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Error interno del servidor'
                        });
                    }
                }
            );

        } catch (error) {
            console.error("Error starting STAR interview:", error);
            res.status(500).json({
                success: false,
                error: "Error al iniciar la entrevista STAR",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async processAudio(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: "No audio file provided"
                });
                return;
            }

            const {
                interviewId,
                currentQuestion,
                questionOrder,
                interviewTypeId,
                difficultyLevel = 'junior'
            } = req.body;

            if (!interviewId || !currentQuestion || questionOrder === undefined) {
                res.status(400).json({
                    success: false,
                    error: "Missing required fields: interviewId, currentQuestion, or questionOrder"
                });
                return;
            }

            const result = await this.interviewService.processAudio(
                userId,
                req.file.path,
                Number(interviewId),
                currentQuestion,
                Number(questionOrder),
                interviewTypeId ? Number(interviewTypeId) : undefined,
                difficultyLevel
            );


            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            result.match(
                (data) => {
                    res.json(data);
                },
                (error) => {
                    console.error("Error en processAudio:", error);
                    if (error.type === 'ValidationError') {
                        res.status(400).json({
                            success: false,
                            message: error.message
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                    }
                }
            );

        } catch (error) {
            console.error("Error processing audio:", error);

            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({
                success: false,
                error: "Error processing audio",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async sendEmail(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                res.status(401).json({ 
                    success: false,
                    message: 'Unauthorized' 
                });
                return;
            }

            const { candidateEmail, candidateName, interviewHistory, summary, difficultyLevel = 'junior' } = req.body;

            console.log("Enviando email:", {
                userId,
                candidateEmail,
                candidateName,
                interviewHistoryLength: interviewHistory?.length || 0,
                hasSummary: !!summary,
                difficultyLevel
            });

            if (!candidateEmail) {
                res.status(400).json({ 
                    success: false,
                    message: "Email del candidato es requerido" 
                });
                return;
            }

            const result = await this.interviewService.sendInterviewEmail(
                candidateEmail,
                candidateName,
                interviewHistory,
                summary,
                difficultyLevel
            );

            result.match(
                (data) => {
                    console.log(" Email enviado correctamente:", {
                        success: data.success,
                        message: data.message
                    });
                    
                 
                    res.json(data);
                },
                (error) => {
                    console.error(" Error en sendEmail:", error);
                    if (error.type === 'ValidationError' || error.type === 'EmailError') {
                        res.status(400).json({ 
                            success: false,
                            message: error.message 
                        });
                    } else {
                        res.status(500).json({ 
                            success: false,
                            message: 'Internal server error' 
                        });
                    }
                }
            );

        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({
                success: false,
                error: "Error al enviar el email",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async evaluateInterview(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

            const { interviewHistory, candidateMetricsHistory, interviewId } = req.body;

            if (!interviewHistory || !Array.isArray(interviewHistory)) {
                res.status(400).json({
                    success: false,
                    message: 'El historial de entrevista es requerido y debe ser un array'
                });
                return;
            }

            if (!startTime) {
                res.status(400).json({
                    success: false,
                    message: 'Start time es requerido para calcular la duración'
                });
                return;
            }

            const result = await this.interviewService.evaluateInterview(
                Number(interviewId),
                interviewHistory,
                candidateMetricsHistory || [],
                interviewId ? Number(interviewId) : undefined
            );

            result.match(
                (data) => {
                    res.json(data);
                },
                (error) => {
                    console.error("Error en evaluateInterview:", error);
                    if (error.type === 'ValidationError') {
                        res.status(400).json({
                            success: false,
                            message: error.message
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                    }
                }
            );

        } catch (error) {
            console.error("Error evaluating interview:", error);
            res.status(500).json({
                success: false,
                error: "Error al evaluar la entrevista",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

  
    getUploadMiddleware() {
        return upload.single('audio');
    }
}