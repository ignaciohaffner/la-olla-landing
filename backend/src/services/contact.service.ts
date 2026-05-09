import { createContactMessage } from '../repositories/contact.repository';
import { sendMail } from '../lib/mailer';

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const submitContact = async (input: ContactInput) => {
  await createContactMessage(input);
  await sendMail({
    subject: `Nuevo mensaje de contacto — ${input.name}`,
    text: [
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Teléfono: ${input.phone}` : '',
      `Mensaje: ${input.message}`,
    ]
      .filter(Boolean)
      .join('\n'),
  });
};
