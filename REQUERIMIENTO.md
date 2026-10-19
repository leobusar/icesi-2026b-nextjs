# Requerimiento: portal "Mis alquileres"

Oct 10, 2026 · @Leonardo

Necesitamos que nuestros clientes puedan buscar carros, reservarlos, ver sus alquileres y cancelarlos desde la web, y que el sistema aguante los cambios que ya sabemos que vienen sin tener que rehacerlo cada vez.

## Quiénes somos

Somos una empresa de alquiler de vehículos en Colombia. Alquilamos carros por días a personas registradas en nuestra plataforma. Hoy tenemos una página web que funciona, pero cada vez que pedimos un cambio pequeño, como ajustar el descuento, el equipo tarda semanas y algo más se daña.

No somos expertos en tecnología. Le escribimos para contarle qué hace nuestro negocio y qué esperamos. Usted decide cómo construirlo.

## Qué necesitan hacer nuestros clientes

1. **Ver sus alquileres.** Al entrar a "Mis alquileres", el cliente ve la lista de sus reservas: qué carro alquiló (marca y modelo), desde cuándo, por cuántos días y cuánto va a pagar.
2. **Cancelar un alquiler.** Si todavía está a tiempo, el cliente ve un botón para cancelar. Si ya no está a tiempo, el botón no debe aparecer.
3. **Saber si algo salió mal.** Si no se pueden cargar los alquileres o la cancelación falla, el cliente debe enterarse con un mensaje claro. Hoy a veces el alquiler desaparece de la pantalla aunque no se haya cancelado, y luego el cliente nos llama molesto.
4. **Buscar carros disponibles.** El cliente elige una fecha de inicio y una de fin, y ve los carros libres en ese periodo con su tarifa diaria.
5. **Reservar un carro.** El cliente elige uno de los carros disponibles y, antes de confirmar, ve cuántos días son y cuánto va a pagar, con el descuento si aplica. Al confirmar, la reserva aparece en "Mis alquileres".

Solo los clientes que iniciaron sesión pueden ver esta pantalla, y cada uno ve únicamente sus propios alquileres.

## Reglas del negocio

Así funciona nuestro negocio hoy. Estas reglas son lo más importante para nosotros: si cambian, queremos poder cambiarlas en un solo lugar.

**Cómo cobramos.** Cobramos por día. Si el cliente devuelve el carro una hora tarde, le cobramos el día completo. Por ejemplo, si alquila de lunes a las 10 de la mañana a miércoles a las 11, son tres días.

**El descuento.** Si el alquiler dura una semana o más, le damos un 10 % de descuento sobre el total. Por ejemplo, con una tarifa de $150.000 diarios, una semana cuesta $945.000 en lugar de $1.050.000.

**Cuándo se puede cancelar.** El cliente puede cancelar sin problema si faltan más de 24 horas para recoger el carro. Si faltan 24 horas o menos, o el alquiler ya empezó, ya no puede cancelar desde la web y tiene que llamarnos.

**Las fechas.** Un alquiler siempre termina después de empezar. Si alguna vez aparece uno que no cumple esto, es un error y no debe mostrarse como si estuviera bien.

**Las placas.** Nuestros carros tienen placa colombiana de vehículo particular: tres letras y tres números, como ABC123.

**Los precios.** Manejamos todo en pesos colombianos, sin centavos. Nunca hay precios negativos.

**Las reservas.** No se puede reservar en el pasado: la reserva debe empezar al menos 2 horas después del momento en que se hace, para alcanzar a alistar el carro. Un alquiler dura mínimo un día y máximo 30 días; para más tiempo tenemos contratos aparte. Un carro no se puede reservar dos veces para fechas que se crucen.

**El precio de la reserva.** El precio que el cliente ve antes de confirmar debe ser exactamente el que aparece después en "Mis alquileres". Si no coinciden, el cliente reclama y tenemos que cobrar el menor.

**Cuando dos personas quieren el mismo carro.** Puede pasar que un carro aparezca libre y, mientras el cliente confirma, otra persona lo reserve. En ese caso, el cliente debe ver un mensaje claro y poder elegir otro carro sin volver a llenar las fechas.

## Cómo queremos que se vea

No tenemos un diseño definido; nos interesa que la información sea clara. Cada alquiler debe mostrar algo así:

> Mazda CX-30 — 3/11/2026 · 7 días · $945.000   \[Cancelar\]

- Las fechas en formato colombiano (día/mes/año) y en hora de Colombia.
- Los precios con punto de miles y el signo de pesos.
- El botón "Cancelar" solo cuando la cancelación está permitida.
- Un mensaje entendible cuando algo falla, no un código de error.

Para reservar, basta un formulario sencillo: fecha y hora de inicio, fecha y hora de fin, y la lista de carros disponibles. Al elegir un carro, debe verse un resumen antes de confirmar:

> Mazda CX-30 · 3/11/2026 al 10/11/2026 · 7 días · ~~$1.050.000~~ $945.000 (10 % de descuento)   \[Confirmar reserva\]

Si las fechas no son válidas, el cliente debe saberlo mientras llena el formulario, no después de enviarlo.

## Cosas que sabemos que van a cambiar

Esta es la razón principal por la que lo contratamos. Estos cambios ya están en camino y no queremos que cada uno sea un proyecto nuevo.

1. **El equipo que maneja nuestro servidor va a reorganizar la información.** Nos dijeron que van a cambiar los nombres de algunos datos (por ejemplo, la fecha de inicio y la marca del carro) en la próxima versión. Nos aseguran que la información será la misma, solo organizada distinto.
2. **Queremos descuentos por temporada.** En diciembre y Semana Santa queremos poder cambiar el porcentaje y la cantidad de días que se exige para el descuento.
3. **Estamos evaluando cambiar el plazo de cancelación** de 24 a 48 horas para algunos tipos de carro.
4. **Seguridad nos pidió cambiar la forma en que guardamos la sesión del cliente** en el navegador. No entendemos bien los detalles, pero no debería cambiar nada de lo que ve el cliente.
5. **Vamos a pasar a un servidor nuevo en producción.** La dirección del sistema va a cambiar al menos dos veces este año (pruebas y producción).
6. **Mercadeo quiere renovar el diseño visual** en unos meses, con otros colores, otros componentes y quizás otra librería de diseño.
7. **Queremos una app móvil más adelante.** Nos gustaría que las reglas del negocio no se tengan que volver a escribir para la app.

## Lo que no necesitamos por ahora

- Pagos ni facturación: la reserva se paga al recoger el carro.
- Modificar una reserva ya hecha: por ahora, el cliente cancela y vuelve a reservar.
- La pantalla de inicio de sesión: ya existe y funciona.
- Cambios en el servidor: ese equipo es otro y no depende de nosotros. No sabemos si el servidor ya permite consultar disponibilidad y crear reservas; si falta algo, díganos qué necesita para pedírselo.

## Lo que esperamos recibir

Antes de que empiece a construir, queremos una propuesta que podamos revisar juntos:

- [ ] Cómo va a organizar el sistema y por qué.
- [ ] Para cada regla del negocio, dónde va a quedar y cómo vamos a saber que funciona.
- [ ] Para cada uno de los siete cambios de la sección anterior, qué partes del sistema habría que tocar.
- [ ] Las preguntas que tenga para nosotros: preferimos que pregunte antes de suponer.
