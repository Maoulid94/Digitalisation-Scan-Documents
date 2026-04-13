import { useEffect, useState } from "react";
import { getListPatients } from "../services/laboService";
import { getListMedecins } from "../services/medecinService";
import Loading from "../components/shared/Loading";

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<"labo" | "medecin">("labo");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔐 Safe render (fix object error)
  const safeValue = (value: any) => {
    if (!value || typeof value === "object") return "-";
    return value;
  };

  // 🎨 Status color
  const getStatusColor = (test: string) => {
    if (!test) return "";
    if (test.includes("NÉGATIF")) return "text-green-600";
    return "text-red-500";
  };

  // 🚀 Fetch function
  const fetchData = async (showLoader = false) => {
    if (showLoader) setLoading(true);

    if (activeTab === "labo") {
      const res = await getListPatients(user?.email);
      if (res.success) setData(res.data);
    } else {
      const res = await getListMedecins(user?.email);
      if (res.success) setData(res.data);
    }

    if (showLoader) setLoading(false);
  };

  // ✅ First load (with loading)
  useEffect(() => {
    fetchData(true);
  }, []);

  // 🔄 Reload ONLY when tab changes (no loading)
  useEffect(() => {
    fetchData(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-100 p-6">
      {/* ================= HEADER ================= */}
      <div
        className="flex justify-between items-center mb-6 
        bg-white/40 backdrop-blur-md border border-purple-200 
        rounded-2xl px-6 py-4 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-purple-700">Patients</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("labo")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === "labo"
                ? "bg-linear-to-r from-purple-600 to-purple-500 text-white shadow-md"
                : "bg-white/50 text-purple-600 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            Labo
          </button>

          <button
            onClick={() => setActiveTab("medecin")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === "medecin"
                ? "bg-linear-to-r from-purple-600 to-purple-500 text-white shadow-md"
                : "bg-white/50 text-purple-600 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            Médecin
          </button>
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <Loading visible={loading} />
      ) : (
        /* ================= TABLE ================= */
        <div
          className="overflow-x-auto 
          bg-white/40 backdrop-blur-md 
          border border-purple-200 
          rounded-2xl shadow-sm"
        >
          <table className="min-w-full text-sm table-auto">
            {/* ================= TABLE HEADER ================= */}
            <thead className="text-purple-700 text-xs uppercase border-b border-purple-300">
              {activeTab === "labo" ? (
                <tr>
                  <th className="p-3 text-center">ID</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-center">Sexe</th>
                  <th className="p-3 text-center">Âge</th>
                  <th className="p-3 text-left">Quartier</th>
                  <th className="p-3 text-left">Nationalité</th>
                  <th className="p-3 text-center">Test</th>
                  <th className="p-3 text-left">Centre</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">IMAGE</th>
                </tr>
              ) : (
                <tr>
                  <th className="p-3 text-center">ID</th>
                  <th className="p-3 text-left">Docteur</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-center">Sexe</th>
                  <th className="p-3 text-center">Âge</th>
                  <th className="p-3 text-left">Nationalité</th>
                  <th className="p-3 text-left">Motif</th>
                  <th className="p-3 text-left">Diagnostic</th>
                  <th className="p-3 text-left">Examen</th>
                  <th className="p-3 text-left">Traitement</th>
                  <th className="p-3 text-left">Observation</th>
                  <th className="p-3 text-left">Centre</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">IMAGE</th>
                </tr>
              )}
            </thead>

            {/* ================= TABLE BODY ================= */}
            <tbody>
              {data.map((item) => (
                <tr
                  key={
                    activeTab === "labo"
                      ? (item.id_labo ?? `labo-${item.nom}-${item.date_test}`)
                      : (item.id_med ?? `med-${item.nom}-${item.date_test}`)
                  }
                  className="border-t border-purple-100 hover:bg-white/30 transition"
                >
                  {activeTab === "labo" ? (
                    <>
                      <td className="p-3 text-center text-violet-700 font-bold">
                        {item.id_labo}
                      </td>

                      <td className="p-3 text-left">
                        <div className="px-3">{item.nom}</div>
                      </td>

                      <td className="p-3 text-center">{item.sexe}</td>
                      <td className="p-3 text-center">{item.age}</td>

                      <td className="p-3 text-left">
                        {safeValue(item.quartier)}
                      </td>

                      <td className="p-3 text-left">{item.nationalite}</td>

                      <td className="p-3 text-center">
                        <span
                          className={`text-xs ${getStatusColor(item.test)}`}
                        >
                          {item.test}
                        </span>
                      </td>

                      <td className="p-3 text-left">{item.centre_sante}</td>
                      <td className="p-3 text-center">{item.date_test}</td>
                      <td className="p-3 text-center">{item.id_img}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 text-center text-violet-700 font-bold">
                        {item.id_med}
                      </td>

                      <td className="p-3 text-left">{item.docteur}</td>

                      <td className="p-3 text-left">
                        <div className="px-3">{item.nom}</div>
                      </td>

                      <td className="p-3 text-center">{item.sexe}</td>
                      <td className="p-3 text-center">{item.age}</td>

                      <td className="p-3 text-left">{item.nationalite}</td>

                      <td className="p-3 text-left">
                        {item.motif_consulation}
                      </td>

                      <td className="p-3 text-left">
                        {safeValue(item.diagnostic)}
                      </td>

                      <td className="p-3 text-left">
                        {safeValue(item.examens_complementaires)}
                      </td>

                      <td className="p-3 text-left">
                        {safeValue(item.traitement)}
                      </td>

                      <td className="p-3 text-left">
                        {safeValue(item.observations)}
                      </td>

                      <td className="p-3 text-left">{item.centre_sante}</td>

                      <td className="p-3 text-center">{item.date_test}</td>
                      <td className="p-3 text-center">{item.id_img}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {data.length === 0 && (
            <p className="text-center p-6 text-purple-400">
              Aucun patient trouvé
            </p>
          )}
        </div>
      )}
    </div>
  );
}
