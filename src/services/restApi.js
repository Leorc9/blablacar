import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase/config'

const mapContactError = (err) => {
  const code = err?.code

  if (code === 'permission-denied') {
    return 'Permission refusée sur Firestore (règles à mettre à jour pour contactMessages).'
  }

  if (code === 'unavailable') {
    return 'Firestore indisponible momentanément. Réessaie dans quelques instants.'
  }

  return err?.message || 'Impossible d’envoyer le message pour le moment.'
}

export const sendContactMessage = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      createdAt: new Date().toISOString(),
      status: 'new'
    })

    return {
      id: docRef.id,
      status: 'sent'
    }
  } catch (err) {
    throw new Error(mapContactError(err))
  }
}
