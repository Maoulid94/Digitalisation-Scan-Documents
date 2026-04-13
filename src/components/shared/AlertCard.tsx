import { useEffect, useState } from "react";
import { XCircle, CheckCircle } from "lucide-react";

interface AlertProps {
  message: string;
  type: "error" | "success" | "warning";
  onClose: () => void;
}

export default function AlertCard({ message, type, onClose }: AlertProps) {
  const [leaving, setLeaving] = useState(false);

  // Auto close with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true); // trigger slide out
      setTimeout(onClose, 300); // wait animation end
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    error: {
      border: "border-red-200",
      stripe: "bg-red-500",
      text: "text-red-700",
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
    },
    success: {
      border: "border-green-200",
      stripe: "bg-green-500",
      text: "text-green-700",
      icon: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
    },
    warning: {
      border: "border-blue-200",
      stripe: "bg-blue-500",
      text: "text-blue-700",
      icon: <XCircle className="w-5 h-5 text-blue-500 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${
        leaving ? "animate-slideOutRight" : "animate-slideInRight"
      }`}
    >
      <div
        className={`flex items-center gap-3 bg-white border ${current.border} rounded-xl shadow-lg min-w-75 overflow-hidden`}
      >
        {/* LEFT STRIPE */}
        <div className={`w-1.5 ${current.stripe} h-full`} />

        {/* CONTENT */}
        <div
          className={`flex items-center gap-3 px-4 py-3 w-full ${current.text}`}
        >
          {current.icon}

          <p className="flex-1 text-sm font-medium leading-tight">{message}</p>
        </div>
      </div>
    </div>
  );
}
