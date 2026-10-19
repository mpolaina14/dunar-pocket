import {
  Button,
  Chip,
  DangerIcon,
  FieldError,
  Input,
  Label,
  Meter,
  Skeleton,
  SuccessIcon,
  TextField,
  WarningIcon,
} from "@heroui/react";

// Página temporal de B-03: sirve para comprobar tokens y componentes de HeroUI.
export default function DesignTestPage() {
  return (
    <main className="flex w-full max-w-md flex-col gap-8 p-4">
      <section className="flex flex-col gap-4">
        <h1>Heading h1</h1>
        <h2>Heading h2</h2>
        <h3>Heading h3</h3>
        <h4>Heading h4</h4>
        <p>Paragraph text</p>
        <small>Small text</small>
      </section>

      <section aria-labelledby="botones" className="flex flex-col gap-4">
        <h2 id="botones">Botones</h2>
        <Button>Primario</Button>
        <Button variant="secondary">Secundario</Button>
      </section>

      <section aria-labelledby="campos" className="flex flex-col gap-4">
        <h2 id="campos">Campos</h2>
        <TextField name="email-normal" type="email">
          <Label>Email</Label>
          <Input placeholder="jane@example.com" />
        </TextField>
        <TextField isInvalid name="email-error" type="email">
          <Label>Email con error</Label>
          <Input placeholder="user@example.com" />
          <FieldError>Introduce un email válido</FieldError>
        </TextField>
      </section>

      <section aria-labelledby="presupuesto" className="flex flex-col gap-4">
        <h2 id="presupuesto">Estados de presupuesto</h2>

        <div className="flex flex-col gap-2">
          <Meter aria-label="Ocio" color="success" value={45}>
            <Label>Ocio</Label>
            <Meter.Output />
            <Meter.Track>
              <Meter.Fill />
            </Meter.Track>
          </Meter>
          <Chip color="success" variant="soft">
            <SuccessIcon className="size-4" />
            <Chip.Label>En rango</Chip.Label>
          </Chip>
        </div>

        <div className="flex flex-col gap-2">
          <Meter aria-label="Comida" color="warning" value={85}>
            <Label>Comida</Label>
            <Meter.Output />
            <Meter.Track>
              <Meter.Fill />
            </Meter.Track>
          </Meter>
          <Chip color="warning" variant="soft">
            <WarningIcon className="size-4" />
            <Chip.Label>Cerca del límite</Chip.Label>
          </Chip>
        </div>

        <div className="flex flex-col gap-2">
          <Meter aria-label="Transporte" color="danger" value={100}>
            <Label>Transporte</Label>
            <Meter.Output />
            <Meter.Track>
              <Meter.Fill />
            </Meter.Track>
          </Meter>
          <Chip color="danger" variant="soft">
            <DangerIcon className="size-4" />
            <Chip.Label>Superado</Chip.Label>
          </Chip>
        </div>
      </section>

      <section aria-labelledby="carga" className="flex flex-col gap-4">
        <h2 id="carga">Estado de carga</h2>
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </section>
    </main>
  );
}
