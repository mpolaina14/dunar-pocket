import { describe, expect, it } from "vitest";
import { z } from "zod";
import { esquemaLogin, esquemaRegistro } from "./esquemas";

describe("esquemaRegistro", () => {
  const datosValidos = {
    nombre: "Manuel",
    email: "manuel@email.com",
    password: "takata1234",
  };

  it("Acepta datos válidos y limpia el email", () => {
    const datos = {
      ...datosValidos,
      email: "  Manuel@email.COM",
    };
    const resultado = esquemaRegistro.safeParse(datos);
    if (!resultado.success) {
      throw new Error("El esquema rechazó datos válidos");
    }
    expect(resultado.data.email).toBe("manuel@email.com");
  });

  it.each(["", "    "])("Rechaza un nombre %j", (nombre) => {
    const datos = {
      ...datosValidos,
      nombre,
    };

    const resultado = esquemaRegistro.safeParse(datos);
    if (resultado.success) {
      throw new Error("El esquema ha dejado pasar nombres inválidos");
    }
    const errores = z.flattenError(resultado.error);
    expect(errores.fieldErrors.nombre).toEqual(["Escribe tu nombre"]);
  });

  it.each(["", "    "])("Rechaza un email %j", (email) => {
    const datos = {
      ...datosValidos,
      email,
    };

    const resultado = esquemaRegistro.safeParse(datos);
    if (resultado.success) {
      throw new Error("El esquema ha dejado pasar emails inválidos");
    }
    const errores = z.flattenError(resultado.error);
    expect(errores.fieldErrors.email).toEqual(["Escribe tu email"]);
  });

  it.each(["manuelemail.com", "manuel@", "ma nuel@email.com", "manuel@email"])(
    "Rechaza un email mal formado %j",
    (email) => {
      const datos = {
        ...datosValidos,
        email,
      };
      const resultado = esquemaRegistro.safeParse(datos);
      if (resultado.success) {
        throw new Error("El esquema ha dejado pasar emails inválidos");
      }
      const errores = z.flattenError(resultado.error);
      expect(errores.fieldErrors.email).toEqual(["Email no válido"]);
    },
  );

  it.each(["", "1234567"])(
    "Rechaza una contraseña demasiado corta %j",
    (password) => {
      const datos = {
        ...datosValidos,
        password,
      };

      const resultado = esquemaRegistro.safeParse(datos);
      if (resultado.success) {
        throw new Error("El esquema ha dejado pasar contraseñas cortas");
      }
      const errores = z.flattenError(resultado.error);
      expect(errores.fieldErrors.password).toEqual(["Mínimo 8 caracteres"]);
    },
  );

  it("Rechaza una contraseña de más de 128 caracteres", () => {
    const datos = {
      ...datosValidos,
      password: "a".repeat(129),
    };

    const resultado = esquemaRegistro.safeParse(datos);
    if (resultado.success) {
      throw new Error(
        "El esquema ha dejado pasar una contraseña demasiado larga",
      );
    }
    const errores = z.flattenError(resultado.error);
    expect(errores.fieldErrors.password).toEqual(["Máximo 128 caracteres"]);
  });

  it.each([8, 128])(
    "Acepta una contraseña de %i caracteres (límite)",
    (longitud) => {
      const datos = {
        ...datosValidos,
        password: "a".repeat(longitud),
      };

      const resultado = esquemaRegistro.safeParse(datos);
      expect(resultado.success).toBe(true);
    },
  );

  it("No recorta los espacios de la contraseña", () => {
    const password = "  abcdefg  ";
    const datos = {
      ...datosValidos,
      password,
    };

    const resultado = esquemaRegistro.safeParse(datos);
    if (!resultado.success) {
      throw new Error("El esquema rechazó una contraseña válida con espacios");
    }
    expect(resultado.data.password).toBe(password);
  });
});

describe("esquemaLogin", () => {
  const datosValidos = {
    email: "fabio@mail.com",
    password: "12345678",
  };

  it("Acepta datos válidos y limpia el email en login", () => {
    const datos = {
      ...datosValidos,
      email: "  Fabio@Mail.COM",
    };
    const resultado = esquemaLogin.safeParse(datos);
    if (!resultado.success) {
      throw new Error("El esquema rechazó los datos válidos");
    }
    expect(resultado.data.email).toBe("fabio@mail.com");
  });

  it.each(["", "    "])("Rechaza un email %j", (email) => {
    const datos = {
      ...datosValidos,
      email,
    };
    const resultado = esquemaLogin.safeParse(datos);
    if (resultado.success) {
      throw new Error("El esquema ha dejado pasar emails inválidos");
    }
    const errores = z.flattenError(resultado.error);
    expect(errores.fieldErrors.email).toEqual(["Escribe tu email"]);
  });

  it.each(["fabiomail.com", "fabio@", "fa bio@mail.com", "fabio@mail"])(
    "Rechaza un email mal formado %j",
    (email) => {
      const datos = {
        ...datosValidos,
        email,
      };
      const resultado = esquemaLogin.safeParse(datos);
      if (resultado.success) {
        throw new Error("El esquema ha dejado pasar emails inválidos");
      }
      const errores = z.flattenError(resultado.error);
      expect(errores.fieldErrors.email).toEqual(["Email no válido"]);
    },
  );

  it("Rechaza una contraseña vacía", () => {
    const datos = {
      ...datosValidos,
      password: "",
    };

    const resultado = esquemaLogin.safeParse(datos);
    if (resultado.success) {
      throw new Error("El esquema ha dejado pasar contraseñas vacías");
    }
    const errores = z.flattenError(resultado.error);
    expect(errores.fieldErrors.password).toEqual(["Contraseña obligatoria"]);
  });

  it.each(["a", "     "])("Acepta la contraseña %j", (password) => {
    const datos = {
      ...datosValidos,
      password,
    };
    const resultado = esquemaLogin.safeParse(datos);
    if (!resultado.success) {
      throw new Error("El esquema rechazó una contraseña válida");
    }
    expect(resultado.data.password).toBe(password);
  });
});
