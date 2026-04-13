import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParallaxLayout from "../components/shared/ParallaxLayout";
import { loginUser } from "../services/authService";
import Loading from "../components/shared/Loading";
import AlertCard from "../components/shared/AlertCard";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const [, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email && !password) {
      newErrors.email = "Email is required";
      newErrors.password = "Password is required";
    } else if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    } else if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // remove focus
    (document.activeElement as HTMLElement)?.blur();

    if (!validate()) return;

    setLoading(true);

    try {
      const loggedUser = await loginUser({ email, password });

      setUser(loggedUser);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
        }),
      );

      navigate("/home", { replace: true });
    } catch (err: any) {
      const rawMessage = err.message || "Erreur lors de la connexion";

      const cleanMessage = rawMessage.includes(":")
        ? rawMessage.split(":")[1].trim()
        : rawMessage;

      setError(cleanMessage);
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxLayout>
      {/* Alert */}
      {error && (
        <AlertCard
          message={error}
          type={alertType}
          onClose={() => setError("")}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-black/5 backdrop-blur-2xl border border-white/30 shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] rounded-3xl p-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">
          Connexion
        </h1>

        {/* Email */}
        <div className="mb-5">
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
              setError("");
            }}
            className={`w-full p-4 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border border-red-500 bg-red-500/10 focus:ring-red-500"
                : "border border-white/20 bg-white/5 focus:ring-purple-500 focus:bg-white/10"
            }`}
          />
          {errors.email && (
            <p className="text-red-400 px-1 py-1 text-xs mt-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-8 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setErrors((prev) => ({ ...prev, password: "" }));
              setError("");

              if (value.length === 0) {
                setShowPassword(false);
              }
            }}
            className={`w-full p-4 pr-12 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
              errors.password
                ? "border border-red-500 bg-red-500/10 focus:ring-red-500"
                : "border border-white/20 bg-white/5 focus:ring-purple-500 focus:bg-white/10"
            }`}
          />

          {/* Eye */}
          {password.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {errors.password && (
            <p className="text-red-400 px-1 py-1 text-xs mt-1 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-violet-400 active:scale-[0.98] transition-all shadow-xl"
        >
          {loading ? (
            <Loading visible={loading} text="Connexion ..." />
          ) : (
            "Se connecter"
          )}
        </button>

        <p className="mt-8 text-center text-white/40 text-[12px] border-b border-violet/20 uppercase tracking-widest font-bold">
          Digitalisation Par LARIA
        </p>
      </form>
    </ParallaxLayout>
  );
}
