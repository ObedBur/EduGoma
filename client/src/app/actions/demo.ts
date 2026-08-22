"use server";

export interface DemoRequestPayload {
  contactName: string;
  schoolName: string;
  phone: string;
  email?: string;
  studentRange?: string;
  message?: string;
}

export interface DemoRequestResult {
  success: boolean;
  error?: string;
}

// Validation du numéro RDC : +243XXXXXXXXX ou 0XXXXXXXXX (9 chiffres après le préfixe)
function isValidRDCPhone(phone: string): boolean {
  return /^(\+243|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));
}

export async function submitDemoRequest(
  payload: DemoRequestPayload
): Promise<DemoRequestResult> {
  // Validation côté serveur
  if (!payload.contactName?.trim()) {
    return { success: false, error: "Le nom du contact est obligatoire." };
  }
  if (!payload.schoolName?.trim()) {
    return { success: false, error: "Le nom de l'établissement est obligatoire." };
  }
  if (!payload.phone?.trim()) {
    return { success: false, error: "Le numéro de téléphone est obligatoire." };
  }
  if (!isValidRDCPhone(payload.phone)) {
    return {
      success: false,
      error: "Le numéro doit être au format RDC (+243XXXXXXXXX ou 0XXXXXXXXX).",
    };
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

    const response = await fetch(`${backendUrl}/demo-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: payload.contactName.trim(),
        schoolName: payload.schoolName.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || undefined,
        studentRange: payload.studentRange || undefined,
        message: payload.message?.trim() || undefined,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: data?.message ?? "Une erreur s'est produite. Réessayez plus tard.",
      };
    }

    return { success: true };
  } catch {
    // En mode dev/démo, on simule une réussite si le backend n'est pas disponible
    if (process.env.NODE_ENV === "development") {
      console.log("[DemoRequest] Backend non disponible, simulation de succès en dev");
      return { success: true };
    }
    return {
      success: false,
      error: "Impossible de contacter le serveur. Vérifiez votre connexion.",
    };
  }
}
