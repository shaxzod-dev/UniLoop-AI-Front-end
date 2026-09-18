import { z } from "zod";
import {
  dtoEnvelope,
  idSchema,
  nextActionSchema,
  professorSchema,
  studentSchema,
  timestampSchema,
} from "@/lib/api/schemas";
export const outcomeSchema = z.object({
  id: idSchema,
  courseId: idSchema,
  title: z.string(),
  description: z.string(),
});
export const materialSchema = z.object({
  id: idSchema,
  courseId: idSchema,
  title: z.string(),
  content: z.string(),
  uploadedAt: timestampSchema,
});
export const courseSummaryDtoSchema = z.object({
  id: idSchema,
  title: z.string(),
  code: z.string(),
  professorId: idSchema,
  studentCount: z.number().int().nonnegative(),
  outcomeCount: z.number().int().nonnegative(),
});
const enrollmentStatusSchema = z.enum([
  "AVAILABLE",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ENROLLED",
]);
export const courseCatalogItemSchema = courseSummaryDtoSchema.extend({
  description: z.string(),
  professorName: z.string(),
  enrollmentStatus: enrollmentStatusSchema,
  enrollmentRequestId: idSchema.nullable(),
  requestedAt: timestampSchema.nullable(),
  decisionNote: z.string().nullable(),
});
export const enrollmentRequestSchema = z.object({
  id: idSchema,
  courseId: idSchema,
  studentId: idSchema,
  studentName: z.string(),
  university: z.string().nullable(),
  faculty: z.string().nullable(),
  major: z.string().nullable(),
  studyYear: z.number().int().nullable(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  requestedAt: timestampSchema,
  decidedAt: timestampSchema.nullable(),
  decisionNote: z.string().nullable(),
});
export const courseDetailDtoSchema = courseSummaryDtoSchema.extend({
  description: z.string(),
  professor: professorSchema,
  students: z.array(studentSchema),
  enrollments: z.array(
    z.object({
      studentId: idSchema,
      courseId: idSchema,
      enrolledAt: timestampSchema,
    }),
  ),
  outcomes: z.array(outcomeSchema),
  materials: z.array(materialSchema),
  assessments: z.array(
    z.object({
      id: idSchema,
      courseId: idSchema,
      title: z.string(),
      type: z.enum(["DIAGNOSTIC", "FOLLOW_UP"]),
      questionCount: z.number().int().nonnegative(),
      submissionCount: z.number().int().nonnegative(),
    }),
  ),
  latestFeedback: z.string().nullable(),
});
export const dashboardSchema = z.object({
  userId: idSchema,
  courseIds: z.array(idSchema),
  nextAction: nextActionSchema.nullable(),
  feedback: z.string().nullable(),
});
export const courseListResponseSchema = dtoEnvelope(
  z.array(courseSummaryDtoSchema),
);
export const courseCatalogResponseSchema = dtoEnvelope(
  z.array(courseCatalogItemSchema),
);
export const enrollmentRequestsResponseSchema = dtoEnvelope(
  z.array(enrollmentRequestSchema),
);
export const enrollmentRequestResponseSchema = dtoEnvelope(
  enrollmentRequestSchema.omit({
    studentName: true,
    university: true,
    faculty: true,
    major: true,
    studyYear: true,
  }).extend({ status: enrollmentStatusSchema }),
);
export const courseResponseSchema = dtoEnvelope(courseDetailDtoSchema);
export const dashboardResponseSchema = dtoEnvelope(dashboardSchema);
export const materialInputSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1).max(100_000),
  })
  .strict();
export const generationInputSchema = z
  .object({ type: z.enum(["DIAGNOSTIC", "FOLLOW_UP"]) })
  .strict();
