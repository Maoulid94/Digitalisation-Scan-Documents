const BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginPayload) => {
  try {
    const res = await fetch(`${BASE_URL}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            Login: email,
            MotPasse: password,
          },
        ],
      }),
    });

    const json = await res.json();

    // erreur HTTP
    if (!res.ok) {
      throw new Error(json?.message || "Erreur serveur");
    }

    // erreur logique API
    if (!json?.succes) {
      throw new Error(json?.message || "Email ou mot de passe incorrect");
    }

    // succès
    return json;
  } catch (error: any) {
    throw new Error(error.message || "Impossible de se connecter au serveur");
  }
};
