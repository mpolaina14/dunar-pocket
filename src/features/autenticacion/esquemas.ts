import { z } from "zod";

export const esquemaRegistro = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Escribe tu nombre")
    .max(50, "Máximo 50 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Escribe tu email")
    .max(254, "Máximo 254 caracteres")
    .pipe(z.email("Email no válido")),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(128, "Máximo 128 caracteres"),
});

export const esquemaLogin = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Escribe tu email")
    .max(254, "Máximo 254 caracteres")
    .pipe(z.email("Email no válido")),
  password: z.string().min(1, "Contraseña obligatoria"),
});

export type DatosRegistro = z.infer<typeof esquemaRegistro>;
export type DatosLogin = z.infer<typeof esquemaLogin>;
