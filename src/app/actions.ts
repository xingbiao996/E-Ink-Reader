'use server'

import { revalidatePath } from 'next/cache'

// In a real application, these actions would interact with a database.
// For this demo, they only log to the console to simulate the behavior.

export async function addSourceAction(formData: FormData) {
  const url = formData.get('url')
  if (typeof url !== 'string' || !url) {
    return { success: false, message: 'Invalid URL' };
  }
  console.log(`Simulating: Add source with URL: ${url}`)
  
  // If we had a database, we would add the source and then revalidate.
  // revalidatePath('/')
  
  return { success: true, message: 'Source added (simulated).' }
}

export async function deleteSourceAction(id: string) {
    if (typeof id !== 'string' || !id) {
        return { success: false, message: 'Invalid source ID' };
    }
    console.log(`Simulating: Delete source with ID: ${id}`)

    // If we had a database, we would delete the source and then revalidate.
    // revalidatePath('/')

    return { success: true, message: 'Source deleted (simulated).' }
}
