import {
  getPizzaPartyConfig,
  createPizzaPartyRequest,
} from '../repositories/pizzaParty.repository';
import { sendMail } from '../lib/mailer';

export const getConfig = async () => {
  const { id: _id, ...publicFields } = await getPizzaPartyConfig();
  return publicFields;
};

export interface SubmitRequestInput {
  name: string;
  email: string;
  phone: string;
  eventDate: Date;
  guests: number;
  extraHours: number;
  extraMozzos: number;
  message?: string;
}

export const submitRequest = async (input: SubmitRequestInput) => {
  const config = await getPizzaPartyConfig();

  const totalPrice =
    input.guests * config.pricePerPerson +
    input.extraHours * config.extraHourPrice +
    input.extraMozzos * config.mozzoPrice;

  const record = await createPizzaPartyRequest({ ...input, totalPrice });

  await sendMail({
    subject: `Nueva solicitud de Pizza Party — ${input.name}`,
    text: [
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      `Teléfono: ${input.phone}`,
      `Fecha del evento: ${input.eventDate.toISOString().split('T')[0]}`,
      `Invitados: ${input.guests}`,
      `Horas extra: ${input.extraHours}`,
      `Mozzos extra: ${input.extraMozzos}`,
      `Precio total: $${totalPrice}`,
      input.message ? `Mensaje: ${input.message}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  });

  return { id: record.id, totalPrice };
};
