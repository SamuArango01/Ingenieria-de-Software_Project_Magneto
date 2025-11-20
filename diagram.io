// ============================================
// SISTEMA DE ENTREVISTAS CON IA - ARQUITECTURA SIMPLIFICADA
// Modelo: Single-Tenant (Una sola empresa)
// ✅ LISTA PARA ANALYTICS - NO REQUIERE CAMBIOS
// ============================================

// ============================================
// USUARIOS Y AUTENTICACIÓN
// ============================================

// Usuarios del sistema (sincronizados con Clerk)
Table users {
  id varchar [pk, note: 'ID de Clerk']
  email varchar [not null, unique]
  name varchar [not null, note: 'Nombre para personalización de IA']
  role varchar [not null, default: 'candidate', note: 'candidate o recruiter']
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    role [name: 'idx_user_role', note: '✅ OPTIMIZA: Filtrar candidates para analytics']
  }
}

// Campos laborales predefinidos
Table work_fields {
  id integer [pk, increment]
  name varchar [not null, unique, note: 'Desarrollo de Software, Marketing, RRHH, etc.']
  is_active boolean [not null, default: true]
  created_at timestamp [default: `now()`]
}

// Configuración del perfil profesional del usuario
Table user_configuration {
  id integer [pk, increment]
  user_id varchar [not null, unique, ref: > users.id]
  work_field_id integer [ref: > work_fields.id, note: 'Campo laboral seleccionado']
  custom_work_field varchar [null, note: 'Campo personalizado si selecciona "Otro"']
  years_of_experience integer [not null, note: '✅ USADO EN: Analytics dashboard']
  preferred_language varchar [not null, default: 'es', note: 'Idioma: es, en, etc.']
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

// ============================================
// TIPOS DE ENTREVISTA
// ============================================

// Catálogo de tipos de entrevista
Table interview_types {
  id integer [pk, increment]
  name varchar [not null, unique, note: '✅ USADO EN: Score history por tipo']
  description text [null]
  is_active boolean [not null, default: true]
  created_at timestamp [default: `now()`]
  
  indexes {
    is_active [name: 'idx_type_active']
  }
}

// ============================================
// ENTREVISTAS Y EVALUACIONES
// ============================================

// Historial de entrevistas realizadas
Table interviews {
  id integer [pk, increment]
  user_id varchar [not null, ref: > users.id]
  interview_type_id integer [not null, ref: > interview_types.id]
  score decimal(5,2) [null, note: '✅ USADO EN: avg_score, score_history']
  duration_minutes integer [null, note: '✅ USADO EN: avg_duration analytics']
  status varchar [not null, default: 'in_progress', note: '✅ FILTRADO: completed/abandoned']
  started_at timestamp [not null, default: `now()`]
  completed_at timestamp [null, note: '✅ USADO EN: last_interview_date, ordenamiento temporal']
  created_at timestamp [default: `now()`]
  
  indexes {
    (user_id, status) [name: 'idx_user_status', note: '✅ OPTIMIZA: Queries de analytics por usuario']
    completed_at [name: 'idx_completed_date', note: '✅ OPTIMIZA: Entrevistas por mes, ordenamiento']
    (interview_type_id, status) [name: 'idx_type_status']
    status [name: 'idx_interview_status']
  }
}

// Evaluación y feedback de la IA por entrevista
Table interview_evaluations {
  id integer [pk, increment]
  interview_id integer [not null, unique, ref: > interviews.id]
  areas_to_improve text [not null, note: '✅ USADO EN: weaknesses en dashboard']
  strengths text [null, note: '✅ USADO EN: strengths en dashboard']
  ai_feedback text [null, note: 'Retroalimentación detallada de Gemini']
  created_at timestamp [default: `now()`]
  
  indexes {
    interview_id [name: 'idx_eval_interview']
  }
}

// Preguntas y respuestas de cada entrevista
Table interview_qa {
  id integer [pk, increment]
  interview_id integer [not null, ref: > interviews.id]
  question text [not null, note: 'Pregunta generada por la IA']
  answer text [null, note: 'Respuesta del candidato (transcripción de voz)']
  question_order integer [not null, note: 'Orden: 1, 2, 3...']
  asked_at timestamp [not null, default: `now()`]
  answered_at timestamp [null]
  created_at timestamp [default: `now()`]
  
  indexes {
    (interview_id, question_order) [name: 'idx_interview_questions']
  }
}

// ============================================
// NOTAS PARA ANALYTICS
// ============================================

// ✅ TABLA USERS:
// - role = 'candidate' → Filtra solo candidatos en analytics
// - created_at → registeredAt en dashboard
// - name, email → Información básica del candidato

// ✅ TABLA USER_CONFIGURATION:
// - work_field_id + custom_work_field → Campo laboral en dashboard
// - years_of_experience → Experiencia mostrada
// - preferred_language → Para contexto adicional

// ✅ TABLA INTERVIEWS:
// - score → avg_score (promedio), score_history (histórico)
// - duration_minutes → avg_duration (promedio en minutos)
// - status → Filtra 'completed' para métricas válidas
// - completed_at → last_interview_date, ordenamiento temporal
// - COUNT(*) GROUP BY user_id → total_interviews

// ✅ TABLA INTERVIEW_EVALUATIONS:
// - strengths → "Fortalezas" en detalle de candidato
// - areas_to_improve → "Debilidades/Áreas de mejora"
// - Se usa la ÚLTIMA evaluación (ORDER BY completed_at DESC LIMIT 1)

// ✅ QUERIES PRINCIPALES DE ANALYTICS:

// 1. Lista de candidatos:
// SELECT u.name, u.email, wf.name, COUNT(i.id), AVG(i.score), MAX(i.completed_at)
// FROM users u
// JOIN user_configuration uc ON u.id = uc.user_id
// JOIN interviews i ON u.id = i.user_id
// WHERE u.role = 'candidate'
// GROUP BY u.id

// 2. Detalle de candidato:
// - Métricas: COUNT, AVG del usuario específico
// - Score history: SELECT date, score, type ORDER BY date
// - Última evaluación: JOIN interview_evaluations ORDER BY date DESC LIMIT 1

// 3. Overview general:
// - Total candidates: COUNT(users WHERE role='candidate')
// - Total interviews: COUNT(interviews)
// - Completion rate: COUNT(status='completed') / COUNT(*)
// - Por mes: GROUP BY DATE_FORMAT(completed_at, '%Y-%m')

// ============================================
// ÍNDICES CRÍTICOS PARA PERFORMANCE
// ============================================

// ✅ idx_user_role → Filtra candidates rápidamente
// ✅ idx_user_status → Queries por usuario + status
// ✅ idx_completed_date → Ordenamiento y filtrado temporal
// ✅ idx_eval_interview → JOIN rápido con evaluaciones

// ⚠️ SI LA BD ES GRANDE (>10,000 entrevistas):
// Considera agregar índices compuestos adicionales:
// - (user_id, completed_at, status) para queries de historial
// - (completed_at, status) para agregaciones mensuales
