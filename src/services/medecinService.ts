import { getUser } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

// ================= EXTRACTION =================
export const extractMedecin = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/ImageMedecin`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "text/plain",
    },
  });

  const text = await res.text();

  const data = JSON.parse(text);
  const donneesArray = JSON.parse(data.donnees || "[]");

  return {
    success: data.succes,
    message: data.message,
    data: donneesArray,
  };
};

// ================= SAVE =================
export const saveMedecin = async (rows: any[], info: any) => {
  // get user here
  const user = getUser();

  const payload = [
    {
      DateTest: info.date,
      Centre: info.center,
      Docteur: info.doctor,
      Utilisateur: user?.email || "unknown",
      ImageMedecin: info.image?.includes(",")
        ? info.image.split(",")[1]
        : info.image,

      RegistreMed: rows.map((row) => ({
        Nom: row.name,
        Sexe: row.sexe,
        Age: row.age,
        Quartier: row.adresse,
        Nationalite: row.nationalite,
        Motif: row.motif,
        Diagnostic: row.diagnostic,
        Examen: row.examen,
        Traitement: row.traitement,
        Observation: row.observation,
        Incertain: Object.entries(row.incertain || {})
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(", "),
      })),
    },
  ];

  const res = await fetch(`${BASE_URL}/AddMed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify({
      data: payload,
    }),
  });

  const text = await res.text();

  return text ? JSON.parse(text) : null;
};

// ====================== GET ALL MEDECINS by UTILISATEUR =================
export const getListMedecins = async (userEmail: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/ListMed?user=${encodeURIComponent(userEmail)}`,
      {
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
      },
    );

    const text = await res.text();

    const json = text ? JSON.parse(text) : null;

    return {
      success: json?.succes ?? false,
      message: json?.message ?? "",
      data: json?.donnees ?? [],
    };
  } catch (error) {
    console.error("GET LIST ERROR:", error);
    return {
      success: false,
      message: "Erreur réseau",
      data: [],
    };
  }
};
