'use server';

import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export async function handleContactForm(formData: unknown) {
  const parsed = contactFormSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  // In a real application, you would send an email, save to a database, etc.
  // For this example, we'll just log the data.
  console.log('Contact form submitted:');
  console.log(parsed.data);

  return { success: true, message: 'Form submitted successfully!' };
}
