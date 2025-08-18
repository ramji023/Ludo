import React, { useState } from "react";

// -------- Helper Types --------
type DicebearFormat = "svg" | "png" | "jpg" | "webp" | "avif" | "json";
type AvatarCategory = "boys" | "girls" | "men" | "women" | "devils";

interface Avatar {
  id: string;
  category: AvatarCategory;
  url: string;
}

// -------- DiceBear URL Builder --------
function getDicebearUrl(
  style: string,
  seed?: string,
  format: DicebearFormat = "svg",
  options?: Record<string, string | number | boolean | string[]>
): string {
  const base = `https://api.dicebear.com/9.x/${encodeURIComponent(
    style
  )}/${encodeURIComponent(format)}`;
  const parts: string[] = [];

  if (seed) parts.push(`seed=${encodeURIComponent(seed)}`);

  if (options) {
    for (const [k, v] of Object.entries(options)) {
      if (Array.isArray(v)) {
        parts.push(
          `${encodeURIComponent(k)}=${v
            .map((x) => encodeURIComponent(String(x)))
            .join(",")}`
        );
      } else {
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      }
    }
  }

  return parts.length ? `${base}?${parts.join("&")}` : base;
}

// -------- Avatar Seeds --------
const STYLE = "adventurer"; // try 'avataaars', 'micah', 'lorelei', etc.

const seedsByCategory: Record<AvatarCategory, string[]> = {
  boys: ["hiro", "kai", "sora"],
  girls: ["yuki", "hana", "mika"],
  men: ["taro", "kenji", "ryu"],
  women: ["emiko", "yui", "mai"],
  devils: ["azazel", "oni", "rai"],
};

// -------- Avatar Array Generator --------
function makeAvatars(): Avatar[] {
  return (Object.keys(seedsByCategory) as AvatarCategory[]).flatMap(
    (category) =>
      seedsByCategory[category].map((seed) => ({
        id: `${category}-${seed}`,
        category,
        url: getDicebearUrl(STYLE, `${category}-${seed}`),
      }))
  );
}

// -------- Main Component --------
export const AvatarBox = () => {
  const avatarArray = makeAvatars();
  return (
    <div >
      <div className="mb-4 p-5  flex flex-wrap gap-4 justify-center max-h-20 overflow-y-auto">
        {avatarArray.map((a) => (
          <img
            key={a.id}
            src={a.url}
            alt={a.id}
            width={80}
            height={80}
            className="rounded-full object-cover cursor-pointer hover:scale-110 transition"
          />
        ))}
      </div>
    </div>
  );
};

/***
 * 
 * const [category, setCategory] = useState<AvatarCategory | "all">("all");
 const filtered =
    category === "all"
      ? avatarArray
      : avatarArray.filter((a) => a.category === category);

 <h2>DiceBear Avatars (latest API)</h2> 

       <select
        value={category}
        onChange={(e) => setCategory(e.target.value as AvatarCategory | "all")}
      >
        <option value="all">All</option>
        <option value="boys">Boys</option>
        <option value="girls">Girls</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="devils">Devils</option>
      </select> 

 */
