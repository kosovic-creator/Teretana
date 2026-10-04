export function normalizeSmsPhone(value: string) {
  const compact = value.trim().replace(/[\s().-]/g, "").replace(/^00/, "+");
  if (!/^\+[1-9]\d{7,14}$/.test(compact)) {
    throw new Error("Telefon mora biti u međunarodnom formatu, npr. +382..., +387... ili 00382... .");
  }
  return compact;
}
