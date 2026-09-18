import { z } from "zod";
import { dtoEnvelope, idSchema, roleSchema } from "@/lib/api/schemas";
import { t } from "@/i18n";
export const loginInputSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: t("loginEmailInvalid") })),
    password: z
      .string()
      .min(8, t("loginPasswordInvalid"))
      .max(200, t("loginPasswordInvalid")),
  })
  .strict();
export const registerInputSchema = z
  .object({
    name: z.string().trim().min(2, "Ism-familiyangizni kiriting.").max(200),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: t("loginEmailInvalid") })),
    password: z
      .string()
      .min(8, t("loginPasswordInvalid"))
      .max(200, t("loginPasswordInvalid")),
    role: roleSchema,
  })
  .strict();
export const authenticatedUserSchema = z.object({
  id: idSchema,
  profileId: idSchema,
  fullName: z.string().min(1),
  role: roleSchema,
  university: z.string(),
  faculty: z.string(),
  avatarLabel: z.string().min(1),
});
export const loginResponseSchema = dtoEnvelope(
  z.object({ accessToken: z.string().min(1), user: authenticatedUserSchema }),
);
export const registerResponseSchema = loginResponseSchema;
export const meResponseSchema = dtoEnvelope(authenticatedUserSchema);
