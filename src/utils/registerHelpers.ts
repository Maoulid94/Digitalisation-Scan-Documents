export const mapOCRToRows = (data: any[]) => {
  return data.map((item, index) => {
    const incertainFields = item.Incertain
      ? item.Incertain.split(",").map((f: string) => f.trim().toLowerCase())
      : [];

    return {
      id: index + 1,
      name: item.Nom || "",
      sexe: item.Sexe?.toUpperCase() || "",
      age: item.Age || "",
      quartier: item.Quartier || "",
      nationalite: item.Nationalite || "",
      test: item.Test_resultat || "",
      motif: item.Motif || "",
      diagnostic: item.Diagnostic || "",
      examen: item.Examen || "",
      traitement: item.Traitement || "",
      observation: item.Observation || "",
      incertain: {
        nom: incertainFields.includes("nom"),
        sexe: incertainFields.includes("sexe"),
        age: incertainFields.includes("age"),
        quartier: incertainFields.includes("quartier"),
        nationalite: incertainFields.includes("nationalite"),
        test: incertainFields.includes("test_resultat"),
        motif: incertainFields.includes("motif"),
        diagnostic: incertainFields.includes("diagnostic"),
        examen: incertainFields.includes("examen"),
        traitement: incertainFields.includes("traitement"),
        observation: incertainFields.includes("observation"),
      },
    };
  });
};

export const isUncertain = (row: any, field: string) =>
  row.incertain?.[field.toLowerCase()] || false;
