CREATE TYPE "public"."rol_usuario" AS ENUM('usuario', 'administrador');--> statement-breakpoint
CREATE TYPE "public"."tipo_categoria" AS ENUM('gasto', 'ingreso');--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rol" "rol_usuario" DEFAULT 'usuario' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" text NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "tipo_categoria" NOT NULL,
	"color" text NOT NULL,
	"icono" text NOT NULL,
	"archivada_en" timestamp with time zone,
	"creada_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_usuario_nombre_uq" UNIQUE("usuario_id","nombre")
);
--> statement-breakpoint
CREATE TABLE "categorias_por_defecto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "tipo_categoria" NOT NULL,
	"color" text NOT NULL,
	"icono" text NOT NULL,
	"creada_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_por_defecto_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "movimientos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" text NOT NULL,
	"categoria_id" uuid NOT NULL,
	"importe_centimos" integer NOT NULL,
	"fecha" date NOT NULL,
	"nota" varchar(140),
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "movimientos_importe_positivo" CHECK ("movimientos"."importe_centimos" > 0)
);
--> statement-breakpoint
CREATE TABLE "presupuestos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" text NOT NULL,
	"categoria_id" uuid,
	"mes" date NOT NULL,
	"importe_centimos" integer NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "presupuestos_importe_positivo" CHECK ("presupuestos"."importe_centimos" > 0),
	CONSTRAINT "presupuestos_mes_dia_uno" CHECK (extract(day from "presupuestos"."mes") = 1)
);
--> statement-breakpoint
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movimientos_usuario_fecha_idx" ON "movimientos" USING btree ("usuario_id","fecha");--> statement-breakpoint
CREATE UNIQUE INDEX "presupuestos_global_mes_uq" ON "presupuestos" USING btree ("usuario_id","mes") WHERE "presupuestos"."categoria_id" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "presupuestos_categoria_mes_uq" ON "presupuestos" USING btree ("usuario_id","categoria_id","mes") WHERE "presupuestos"."categoria_id" is not null;