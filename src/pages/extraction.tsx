import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { extractLabo } from "../services/laboService";
import { extractMedecin } from "../services/medecinService";
import Loading from "../components/shared/Loading";
import AlertCard from "../components/shared/AlertCard";

export default function Extraction() {
  const [center, setCenter] = useState<string | null>(null);
  const [type, setType] = useState<"medecin" | "labo" | null>(null);

  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const isProcessing = useRef(false);

  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const navigate = useNavigate();

  const canShowForm = center && type;

  const compressImage = (
    file: File,
    quality = 0.7,
    maxWidth = 800,
  ): Promise<Blob> =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          "image/jpeg",
          quality,
        );
      };
    });

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleExtract = async () => {
    if (loading || isProcessing.current) return;

    if (!file || !center || !type || !date) {
      setAlertType("error");
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (type === "medecin" && !doctor) {
      setAlertType("error");
      setError("Veuillez saisir le docteur");
      return;
    }

    isProcessing.current = true;
    setLoading(true);

    try {
      let result;

      if (type === "labo") {
        result = await extractLabo(file);
      } else {
        result = await extractMedecin(file);
      }

      const compressedBlob = await compressImage(file, 0.7, 800);

      const base64Full = await toBase64(
        new File([compressedBlob], "compressed.jpg", {
          type: "image/jpeg",
        }),
      );

      const base64Image = base64Full.split(",")[1];

      localStorage.setItem("ocrData", JSON.stringify(result.data));
      localStorage.setItem(
        "registerInfo",
        JSON.stringify({ center, type, date, doctor, image: base64Image }),
      );

      navigate(type === "labo" ? "/registerLabo" : "/registerMedecin");
    } catch (error) {
      console.error(error);
      alert("Erreur API");
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  return (
    <div className="h-screen bg-[#F5F3FF] flex items-center justify-center overflow-hidden">
      {error && (
        <AlertCard
          message={error}
          type={alertType}
          onClose={() => setError("")}
        />
      )}
      <div className="bg-white/70 backdrop-blur-xl border border-purple-200 shadow-[0_10px_40px_rgba(124,58,237,0.15)] rounded-3xl p-6 w-full max-w-2xl h-[90vh] flex flex-col">
        <h1 className="text-xl font-bold text-purple-700 text-center mb-4">
          Extraction
        </h1>

        <div className="flex-1 flex flex-col overflow-hidden">
          <p className="text-purple-400 text-sm mb-2">CENTRE</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["Einguella", "Arhiba", "Farah-Had"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCenter(c);
                  setType(null);
                }}
                className={`py-2 rounded-xl font-semibold transition ${
                  center === c
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-purple-200 text-purple-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {center && (
            <>
              <p className="text-purple-400 text-sm mb-2">TYPE</p>

              <div className="flex bg-purple-100 rounded-2xl p-1 mb-4">
                <button
                  onClick={() => setType("medecin")}
                  className={`flex-1 py-2 rounded-xl font-bold transition ${
                    type === "medecin"
                      ? "bg-white text-purple-700 shadow"
                      : "text-purple-500"
                  }`}
                >
                  MÉDECIN
                </button>

                <button
                  onClick={() => setType("labo")}
                  className={`flex-1 py-2 rounded-xl font-bold transition ${
                    type === "labo"
                      ? "bg-white text-purple-700 shadow"
                      : "text-purple-500"
                  }`}
                >
                  LABO
                </button>
              </div>
            </>
          )}

          {canShowForm && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 mb-3">
                <p className="text-xs text-purple-400">DATE</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-purple-700 font-bold outline-none"
                />
              </div>

              {type === "medecin" && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 mb-3">
                  <p className="text-xs text-purple-400">DOCTEUR</p>
                  <input
                    type="text"
                    placeholder="Dr. Hassan"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full bg-transparent text-purple-700 font-bold outline-none"
                  />
                </div>
              )}

              <label className="block bg-purple-50 border border-purple-200 rounded-2xl p-2 mb-3 cursor-pointer hover:bg-purple-100 transition overflow-hidden">
                <p className="text-xs text-purple-400 px-2 py-1">IMAGE</p>

                <div className="w-full h-36 flex items-center justify-center rounded-xl overflow-hidden">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-purple-400 text-sm">
                      Cliquez pour ajouter une image
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) setFile(selected);
                  }}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExtract}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-purple-600 to-violet-500 text-white font-bold shadow-lg hover:scale-[1.02] transition mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loading visible={loading} text="Extraction..." />
                ) : (
                  "Extraction"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
