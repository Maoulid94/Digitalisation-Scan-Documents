import { getUser } from "../utils/auth";

const user = getUser();
const BASE_URL = import.meta.env.VITE_API_URL;

// const parseIncertain = (incertainStr: string) => {
//   const fields = incertainStr
//     ?.toLowerCase()
//     .split(",")
//     .map((f) => f.trim());

//   return {
//     nom: fields?.includes("nom") || false,
//     sexe: fields?.includes("sexe") || false,
//     age: fields?.includes("age") || false,
//     quartier: fields?.includes("quartier") || false,
//     nationalite: fields?.includes("nationalite") || false,
//     test: fields?.includes("test_resultat") || false,
//   };
// };

// extraction labo
export const extractLabo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/ImageLabo`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "text/plain",
    },
  });

  const text = await res.text();

  // parse text → JSON
  const data = JSON.parse(text);

  // parse donnees (string → array)
  const donneesArray = JSON.parse(data.donnees || "[]");

  return {
    success: data.succes,
    message: data.message,
    data: donneesArray,
  };
};

// save labo data
export const saveLabo = async (rows: any[], info: any) => {
  const payload = [
    {
      DateTest: info.date,
      Centre: info.center,
      Utilisateur: user?.email || "unknown",
      ImageLabo: info.image?.includes(",")
        ? info.image.split(",")[1]
        : info.image,

      RegistreLabo: rows.map((row) => ({
        Nom: row.name,
        Sexe: row.sexe,
        Age: row.age,
        Quartier: row.quartier,
        Nationalite: row.nationalite,
        Test_resultat: row.test,

        Incertain: Object.entries(row.incertain || {})
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(", "),
      })),
    },
  ];

  const res = await fetch(`${import.meta.env.VITE_API_URL}/AddLabo`, {
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

// Get Liste des patients by user
export const getListPatients = async (userEmail: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/ListLabo?user=${encodeURIComponent(userEmail)}`,
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
