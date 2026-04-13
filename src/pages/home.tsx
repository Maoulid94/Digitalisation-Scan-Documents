import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import { getListPatients } from "../services/laboService";
import { getListMedecins } from "../services/medecinService";

// Icons
import {
  LogOut,
  FlaskConical,
  Stethoscope,
  Users,
  ScanLine,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();

  const [counts, setCounts] = useState({
    labo: 0,
    medecin: 0,
  });

  // Username
  const getUserName = (email?: string) => {
    if (!email) return "Utilisateur";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const userName = getUserName(user?.email);

  // Load counts
  useEffect(() => {
    const fetchCounts = async () => {
      const labo = await getListPatients(user?.email);
      const med = await getListMedecins(user?.email);

      setCounts({
        labo: labo?.data?.length || 0,
        medecin: med?.data?.length || 0,
      });
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex flex-col p-6 gap-6">
      {/* ================= HEADER ================= */}
      <div className="w-full bg-[#f3f0ff] border border-purple-200 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
        <h2 className="text-purple-700 font-semibold text-lg">
          Bienvenue, <span className="text-purple-600">{userName}</span>
        </h2>

        {/* Déconnexion */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/", { replace: true });
          }}
          className="
            relative overflow-hidden flex items-center gap-2
            px-6 py-2 rounded-full text-white font-semibold
            bg-linear-to-r from-purple-600 to-purple-500
            shadow-md cursor-pointer
            transition-all duration-300

            hover:scale-105 hover:shadow-lg
            active:scale-95
          "
        >
          <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition blur-md"></span>
          <LogOut size={18} className="relative z-10" />
          <span className="relative z-10">Déconnexion</span>
        </button>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            Tableau de bord
          </h1>
          <p className="text-purple-400">
            Gestion et extraction des données médicales
          </p>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
          {/* LABO CARD */}
          <div
            className="group bg-white/70 backdrop-blur-md border border-purple-200 rounded-2xl p-6 h-44 flex flex-col justify-between shadow-sm 
            hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-700">LABO</h3>
              <FlaskConical className="text-purple-500 group-hover:scale-110 transition" />
            </div>

            <p className="text-purple-400 text-sm">
              Résultats d’analyses de laboratoire
            </p>

            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-purple-700">
                {counts.labo}
              </span>
              <span className="text-xs text-purple-400">Patients</span>
            </div>
          </div>

          {/* MÉDECIN CARD */}
          <div
            className="group bg-white/70 backdrop-blur-md border border-purple-200 rounded-2xl p-6 h-44 flex flex-col justify-between shadow-sm 
            hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-700">MÉDECIN</h3>
              <Stethoscope className="text-purple-500 group-hover:scale-110 transition" />
            </div>

            <p className="text-purple-400 text-sm">
              Observations et rapports médicaux
            </p>

            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-purple-700">
                {counts.medecin}
              </span>
              <span className="text-xs text-purple-400">Patients</span>
            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          {/* PATIENTS */}
          <button
            onClick={() => navigate("/patients")}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold 
            bg-linear-to-r from-purple-600 to-purple-500 
            shadow-md hover:scale-105 transition-transform"
          >
            <Users size={18} />
            Voir les patients
          </button>

          {/* EXTRACTION */}
          <button
            onClick={() => navigate("/extraction")}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold
            bg-linear-to-r from-purple-600 to-purple-500 
            text-white shadow-md
            hover:scale-105 transition-transform"
          >
            <ScanLine size={18} />
            Extraction
          </button>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="text-center text-purple-300 text-sm">
        © {new Date().getFullYear()} — Digitalisation par LARIA
      </div>
    </div>
  );
}
