import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapOCRToRows, isUncertain } from "../utils/registerHelpers";
import TableInput from "../components/shared/TableInput";
import { saveLabo } from "../services/laboService";
import AlertCard from "../components/shared/AlertCard";

import {
  sexes,
  quartiers,
  nationalites,
  tests,
  noms_feminins,
  noms_masculins,
} from "../data/info";

export default function RegisterLabo() {
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

  const handleSave = async () => {
    if (!validateHeader()) {
      setAlertType("error");
      setError("Centre, Type de registre et Date sont obligatoires");
      return;
    }

    if (!rows.length) {
      setAlertType("error");
      setError("Aucun enregistrement à sauvegarder");
      return;
    }

    try {
      const res = await saveLabo(rows, info);

      if (res?.succes === false) {
        setAlertType("error");
        setError("Erreur:" + res.message);
        console.error("Save error:", res.message);
        return;
      }

      localStorage.removeItem("ocrData");
      localStorage.removeItem("registerInfo");
      navigate("/extraction", { replace: true });
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setError("Erreur enregistrement LABO");
    }
  };

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
          setError("Confirmer l'enregistrement ?");
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

  const validateHeader = () => info.center && info.type && info.date;

  const grid =
    "grid-cols-[25px_minmax(0,1.3fr)_60px_80px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)]";

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-6 py-4 rounded-2xl bg-linear-to-r from-violet-50 to-white border border-violet-100 shadow-sm">
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Centre</p>
            <p className="font-bold text-violet-600 uppercase">{info.center}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Type</p>
            <p className="font-bold text-violet-600 uppercase">{info.type}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Date</p>
            <p className="font-bold text-violet-600">{info.date}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setAlertType("warning");
            setError("Confirmer l'enregistrement ?");
            setConfirmSave(true);
          }}
          className="px-8 py-2 bg-violet-600 text-white rounded-full text-xs font-bold hover:bg-violet-700 transition-all active:scale-95"
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
                  setConfirmSave(false);
                  setError("");
                }}
                className="px-6 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      )}

      {/* TABLE HEADER */}
      <div
        className={`grid ${grid} gap-2 text-[11px] font-bold text-violet-600 uppercase tracking-wider border-b pb-2 mb-2`}
      >
        <span className="text-center">Id</span>
        <span>Patient</span>
        <span className="text-center">Sexe</span>
        <span className="text-center">Âge</span>
        <span>Quartier</span>
        <span>Nationalite</span>
        <span>Résultat</span>
      </div>

      {/* TABLE */}
      {rows.map((row, i) => (
        <div
          key={row.id}
          className={`grid ${grid} gap-2 items-center py-2 border-b border-gray-100 hover:bg-violet-50/40 transition`}
        >
          <span className="text-center text-[10px] text-violet-600 font-bold">
            {row.id}
          </span>

          {/* NOM */}
          <TableInput
            value={row.name}
            onChange={(v: string) => updateRow(i, "name", v)}
            uncertain={isUncertain(row, "nom")}
            suggestions={
              row.sexe === "F"
                ? noms_feminins
                : row.sexe === "M"
                  ? noms_masculins
                  : [...noms_feminins, ...noms_masculins]
            }
            onSelect={(val: string) => {
              if (noms_feminins.includes(val)) updateRow(i, "sexe", "F");
              if (noms_masculins.includes(val)) updateRow(i, "sexe", "M");
            }}
          />

          {/* SEXE */}
          <TableInput
            value={row.sexe}
            onChange={(v: string) => updateRow(i, "sexe", v)}
            uncertain={isUncertain(row, "sexe")}
            className="text-center"
            suggestions={sexes}
          />

          {/* AGE */}
          <TableInput
            value={row.age}
            onChange={(v: string) => updateRow(i, "age", v)}
            uncertain={isUncertain(row, "age")}
            className="text-center"
          />

          {/* QUARTIER */}
          <TableInput
            value={row.quartier}
            onChange={(v: string) => updateRow(i, "quartier", v)}
            uncertain={isUncertain(row, "quartier")}
            suggestions={quartiers}
          />

          {/* NATIONALITE */}
          <TableInput
            value={row.nationalite}
            onChange={(v: string) => updateRow(i, "nationalite", v)}
            uncertain={isUncertain(row, "nationalite")}
            suggestions={nationalites}
          />

          {/* TEST */}
          <TableInput
            value={row.test}
            onChange={(v: string) => updateRow(i, "test", v)}
            uncertain={isUncertain(row, "test_resultat")}
            suggestions={tests}
          />
        </div>
      ))}
    </div>
  );
}
