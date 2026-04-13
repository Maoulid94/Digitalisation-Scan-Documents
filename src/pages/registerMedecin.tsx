import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapOCRToRows, isUncertain } from "../utils/registerHelpers";
import TableInput from "../components/shared/TableInput";
import { saveMedecin } from "../services/medecinService";
import AlertCard from "../components/shared/AlertCard";
import {
  sexes,
  quartiers,
  nationalites,
  Motifs,
  Diagnostics,
  Examens,
  Traitements,
  noms_feminins,
  noms_masculins,
} from "../data/info";

export default function RegisterMedecin() {
  const [rows, setRows] = useState<any[]>([]);
  const [info, setInfo] = useState<any>({});
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "warning">(
    "error",
  );
  const [confirmSave, setConfirmSave] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("ocrData");
    const infoData = localStorage.getItem("registerInfo");

    if (infoData) setInfo(JSON.parse(infoData));
    if (data) setRows(mapOCRToRows(JSON.parse(data)));
  }, []);

  // ✅ FIXED ENTER (allow input usage)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const active = document.activeElement;

        // allow Enter inside inputs
        if (active && active.tagName === "INPUT") return;

        e.preventDefault();

        if (confirmSave) {
          handleSave();
        } else {
          setAlertType("warning");
          setError("Confirmer l'enregistrement MÉDECIN ?");
          setConfirmSave(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmSave, rows, info]);

  const updateRow = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const validateHeader = () => {
    return info.center && info.type && info.doctor && info.date;
  };

  const handleSave = async () => {
    if (!validateHeader()) {
      setAlertType("error");
      setError("Centre, Type de registre, Docteur et Date sont obligatoires");
      setConfirmSave(false);
      return;
    }

    if (!rows.length) {
      setAlertType("error");
      setError("Aucun enregistrement à sauvegarder");
      setConfirmSave(false);
      return;
    }

    try {
      const res = await saveMedecin(rows, info);

      if (res?.succes === false) {
        setAlertType("error");
        setError("Erreur:" + res.message);
        setConfirmSave(false);
        console.error("Save error:", res.message);
        return;
      }

      localStorage.removeItem("ocrData");
      localStorage.removeItem("registerInfo");
      navigate("/extraction", { replace: true });
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setError("Erreur enregistrement MÉDECIN");
      setConfirmSave(false);
    }
  };

  const grid =
    "grid-cols-[30px_minmax(120px,1.3fr)_50px_75px_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(120px,1.2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(120px,1.2fr)]";

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 px-6 py-4 rounded-2xl bg-linear-to-r from-violet-50 to-white border border-violet-100 shadow-sm">
        <div className="flex items-center gap-8 text-sm">
          <HeaderItem label="Centre" value={info.center} />
          <HeaderItem label="Type" value={info.type} />
          <HeaderItem label="Docteur" value={info.doctor} />
          <HeaderItem label="Date" value={info.date} />
        </div>

        <button
          onClick={() => {
            setAlertType("warning");
            setError("Confirmer l'enregistrement MÉDECIN ?");
            setConfirmSave(true);
          }}
          className="px-10 py-2.5 bg-violet-600 text-white text-[11px] font-bold tracking-widest rounded-full shadow-lg hover:bg-violet-700 active:scale-95 transition"
        >
          ENREGISTRER
        </button>
      </div>

      {/* ALERT */}
      {error && (
        <div className="mb-6 animate-fadeIn">
          <AlertCard
            message={error}
            type={alertType}
            onClose={() => {
              setError("");
              setConfirmSave(false);
            }}
          />
          {confirmSave && alertType === "warning" && (
            <div className="flex gap-3 mt-3 ml-2">
              <button
                onClick={handleSave}
                className="px-6 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-violet-700"
              >
                Confirmer (Entrée)
              </button>
              <button
                onClick={() => {
                  setError("");
                  setConfirmSave(false);
                }}
                className="px-6 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto pb-4">
        <div
          className={`grid ${grid} gap-2 text-[10px] font-bold text-violet-600 uppercase border-b pb-2 mb-2 min-w-300`}
        >
          <span>ID</span>
          <span>Patient</span>
          <span>Sexe</span>
          <span>Âge</span>
          <span>Quartier</span>
          <span>Nationalite</span>
          <span>Motif</span>
          <span>Diagnostic</span>
          <span>Examen</span>
          <span>Traitement</span>
          <span>Observation</span>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.id}
            className={`grid ${grid} gap-2 items-center py-1.5`}
          >
            <span className="text-violet-600 font-bold">{row.id}</span>

            <TableInput
              value={row.name}
              onChange={(v: string) => updateRow(i, "name", v)}
              uncertain={isUncertain(row, "nom")}
              suggestions={[...noms_feminins, ...noms_masculins]} // ✅ ALL names
              onSelect={(val: string) => {
                const words = (row.name || "").split(" ");
                const first = words[0] || val;

                if (noms_feminins.includes(first)) updateRow(i, "sexe", "F");
                else if (noms_masculins.includes(first))
                  updateRow(i, "sexe", "M");
              }}
            />

            <TableInput
              value={row.sexe}
              onChange={(v: string) => updateRow(i, "sexe", v)}
              uncertain={isUncertain(row, "sexe")}
              suggestions={sexes}
            />
            <TableInput
              value={row.age}
              onChange={(v: string) => updateRow(i, "age", v)}
              uncertain={isUncertain(row, "age")}
            />
            <TableInput
              value={row.adresse}
              onChange={(v: string) => updateRow(i, "adresse", v)}
              uncertain={isUncertain(row, "adresse")}
              suggestions={quartiers}
            />
            <TableInput
              value={row.nationalite}
              onChange={(v: string) => updateRow(i, "nationalite", v)}
              uncertain={isUncertain(row, "nationalite")}
              suggestions={nationalites}
            />
            <TableInput
              value={row.motif}
              onChange={(v: string) => updateRow(i, "motif", v)}
              uncertain={isUncertain(row, "motif")}
              suggestions={Motifs}
            />
            <TableInput
              value={row.diagnostic}
              onChange={(v: string) => updateRow(i, "diagnostic", v)}
              uncertain={isUncertain(row, "diagnostic")}
              suggestions={Diagnostics}
            />
            <TableInput
              value={row.examen}
              onChange={(v: string) => updateRow(i, "examen", v)}
              uncertain={isUncertain(row, "examen")}
              suggestions={Examens}
            />
            <TableInput
              value={row.traitement}
              onChange={(v: string) => updateRow(i, "traitement", v)}
              uncertain={isUncertain(row, "traitement")}
              suggestions={Traitements}
            />
            <TableInput
              value={row.observation}
              onChange={(v: string) => updateRow(i, "observation", v)}
              uncertain={isUncertain(row, "observation")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase">{label}</p>
      <p className="font-bold text-violet-600">{value}</p>
    </div>
  );
}
