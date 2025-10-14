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

            console.log("Iniciando entrevista:", {
                clerkUserId,
                candidateName,
                interviewTypeId,
                difficultyLevel
            });

            const result = await this.interviewService.startStarInterview(
                candidateName,
                clerkUserId,
                interviewTypeId ? Number(interviewTypeId) : undefined,
                difficultyLevel
            );

            result.match(
                (data) => {
                    console.log("Entrevista iniciada correctamente:", {
                        initialMessageLength: data.initialMessage?.length,
                        success: data.success
                    });
                
                    res.json({
                        success: true,
                        data: {
                            initialMessage: data.initialMessage, 
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

            const { interviewTypeId, difficultyLevel = 'junior' } = req.body;

            console.log("Procesando audio:", {
                userId,
                interviewTypeId,
                difficultyLevel,
                file: req.file.originalname,
                fileSize: req.file.size
            });

            const result = await this.interviewService.processAudio(
                userId, 
                req.file.path, 
                interviewTypeId ? Number(interviewTypeId) : undefined,
                difficultyLevel
            );

           
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            result.match(
                (data) => {
                    console.log("Audio procesado correctamente:", {
                        tieneAIResponse: !!data.aiResponse,
                        aiResponsePreview: data.aiResponse?.substring(0, 50) + "...",
                        tieneText: !!data.text,
                        textPreview: data.text?.substring(0, 30) + "...",
                        tieneMetrics: !!data.candidateMetrics,
                        canAdvance: data.canAdvanceToNextLevel
                    });
                    
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

    async generateSummary(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                res.status(401).json({ 
                    success: false,
                    message: 'Unauthorized' 
                });
                return;
            }

            const { interviewHistory, candidateMetricsHistory, difficultyLevel = 'junior' } = req.body;

            console.log("Generando summary:", {
                userId,
                interviewHistoryLength: interviewHistory?.length || 0,
                candidateMetricsHistoryLength: candidateMetricsHistory?.length || 0,
                difficultyLevel
            });

            if (!interviewHistory || interviewHistory.length === 0) {
                res.status(400).json({ 
                    success: false,
                    message: "No interview history provided" 
                });
                return;
            }

            const result = await this.interviewService.generateSummary(
                interviewHistory, 
                candidateMetricsHistory,
                difficultyLevel
            );

            result.match(
                (data) => {
                    console.log("Summary generado correctamente:", {
                        summaryLength: data.summary?.length,
                        success: data.success
                    });
                  
                    res.json(data);
                },
                (error) => {
                    console.error("Error en generateSummary:", error);
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
            console.error("Error generating summary:", error);
            res.status(500).json({
                success: false,
                error: "Error al generar summary",
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

    async evaluateLevel(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                res.status(401).json({ 
                    success: false,
                    message: 'Unauthorized' 
                });
                return;
            }

            const { interviewHistory, candidateMetricsHistory, currentLevel = 'junior' } = req.body;

            console.log("Evaluando nivel:", {
                userId,
                interviewHistoryLength: interviewHistory?.length || 0,
                candidateMetricsHistoryLength: candidateMetricsHistory?.length || 0,
                currentLevel
            });

            if (!interviewHistory || !Array.isArray(interviewHistory)) {
                res.status(400).json({ 
                    success: false,
                    message: 'El historial de entrevista es requerido y debe ser un array' 
                });
                return;
            }

            const result = await this.interviewService.evaluateLevel(
                interviewHistory,
                candidateMetricsHistory || [],
                currentLevel
            );

            result.match(
                (data) => {
                    console.log("Nivel evaluado correctamente:", {
                        canAdvance: data.canAdvance,
                        recommendedLevel: data.recommendedLevel,
                        score: data.score,
                        feedbackLength: data.feedback?.length
                    });
                    
                    res.json(data);
                },
                (error) => {
                    console.error("Error en evaluateLevel:", error);
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
            console.error("Error evaluating level:", error);
            res.status(500).json({
                success: false,
                error: "Error al evaluar el nivel",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

  
    getUploadMiddleware() {
        return upload.single('audio');
    }
}