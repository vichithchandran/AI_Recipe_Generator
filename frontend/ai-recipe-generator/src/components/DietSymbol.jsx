// Standard Indian FSSAI Food Preference Symbols (Veg / Non-Veg)

export const VegSymbol = ({ className = "w-4 h-4" }) => (
  <div
    className={`inline-flex items-center justify-center border-2 border-emerald-500 bg-slate-950 rounded-sm p-0.5 shrink-0 ${className}`}
    title="Vegetarian"
  >
    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
  </div>
);

export const NonVegSymbol = ({ className = "w-4 h-4" }) => (
  <div
    className={`inline-flex items-center justify-center border-2 border-rose-600 bg-slate-950 rounded-sm p-0.5 shrink-0 ${className}`}
    title="Non-Vegetarian"
  >
    <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[7px] border-b-rose-600"></div>
  </div>
);

export const DietSymbol = ({ category = "", tags = [], ingredients = [], name = "", className = "w-4 h-4" }) => {
  const nonVegTerms = [
    "meat", "chicken", "beef", "pork", "mutton", "lamb", "fish", "seafood",
    "shrimp", "prawn", "egg", "eggs", "bacon", "turkey", "ham", "sausage", "salmon", "tuna"
  ];

  const catLower = (category || "").toLowerCase();
  const nameLower = (name || "").toLowerCase();
  const tagsLower = tags.map((t) => (t || "").toLowerCase());
  const ingredientsLower = ingredients.map((i) => (typeof i === "string" ? i : i.name || "").toLowerCase());

  let isNonVeg = false;

  // Check Category
  if (catLower === "meat" || catLower === "non-veg") {
    isNonVeg = true;
  }

  // Check Tags
  if (tagsLower.some((t) => t.includes("non-veg") || t.includes("non-vegetarian") || t.includes("meat"))) {
    isNonVeg = true;
  }

  // Check Recipe Name
  if (nonVegTerms.some((term) => nameLower.includes(term))) {
    isNonVeg = true;
  }

  // Check Ingredients
  if (ingredientsLower.some((ing) => nonVegTerms.some((term) => ing.includes(term)))) {
    isNonVeg = true;
  }

  return isNonVeg ? <NonVegSymbol className={className} /> : <VegSymbol className={className} />;
};

export default DietSymbol;
