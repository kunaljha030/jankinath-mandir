// "2026-03-04" -> { day: "04", month: "March" }
export function splitDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "long" }),
  };
}
