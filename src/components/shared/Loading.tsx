type LoadingProps = {
  visible: boolean;
  text?: string;
};

export default function Loading({ visible, text }: LoadingProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/20 animate-loading-overlay">
      {/* Container with your CSS variables */}
      <div className="flex flex-col items-center p-12 bg-white/90 rounded-3xl shadow-(--shadow) animate-loading-content">
        {/* Large Spinner - using your --primary variable */}
        <div
          className="w-20 h-20 border-[6px] border-slate-200 border-t-(--primary) rounded-full animate-loading-spin"
          style={{ borderTopColor: "var(--primary)" }}
        ></div>

        {/* Text */}
        {text && (
          <p className="mt-6 text-xl font-bold text-(--primary) tracking-wide animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
