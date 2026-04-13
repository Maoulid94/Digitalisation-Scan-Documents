import { useState } from "react";

export default function TableInput({
  value,
  onChange,
  uncertain,
  placeholder,
  className = "",
  suggestions = [],
  onSelect,
}: any) {
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const getBorderStyle = () => {
    if (uncertain) return "border-red-500 bg-red-50 text-red-700 ring-red-100";

    return "border-violet-200 bg-white text-gray-700 hover:border-violet-400 focus:border-violet-500 shadow-sm shadow-violet-50/50";
  };

  // ✅ FIX: use last word only
  const lastWord = (value || "").split(" ").pop()?.toLowerCase() || "";

  const filtered = suggestions
    .filter((item: string) => item.toLowerCase().includes(lastWord))
    .slice(0, 6);

  // ✅ FIX: multi-word (no override)
  const selectItem = (item: string) => {
    const words = (value || "").split(" ");

    words[words.length - 1] = item;

    const newValue = words.join(" ").trim();

    onChange(newValue);
    onSelect && onSelect(item);

    setShow(false);
    setActiveIndex(-1);
  };

  return (
    <div className="relative">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setShow(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        onKeyDown={(e) => {
          if (!show) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) =>
              prev < filtered.length - 1 ? prev + 1 : 0,
            );
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : filtered.length - 1,
            );
          }

          if (e.key === "Enter") {
            if (activeIndex >= 0) {
              e.preventDefault();
              selectItem(filtered[activeIndex]);
            }
          }
        }}
        className={`w-full py-2 px-4 text-[11px] rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-violet-100 font-medium ${getBorderStyle()} ${className}`}
      />

      {show && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-violet-100 rounded-xl shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((item: string, i: number) => (
            <div
              key={i}
              onMouseDown={() => selectItem(item)} // ✅ FIX click
              className={`px-4 py-2 text-[11px] cursor-pointer transition ${
                i === activeIndex ? "bg-violet-100" : "hover:bg-violet-50"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
