export function posicionCategoria(nombre: string): string {
  const texto = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (texto.includes("electric")) return "50% 0%";
  if (texto.includes("gas")) return "100% 0%";
  if (texto.includes("pint")) return "0% 100%";
  if (texto.includes("jardin")) return "50% 100%";
  if (texto.includes("carpin")) return "100% 100%";
  return "0% 0%";
}

export function iconoCategoria(nombre: string): string {
  const texto = nombre.toLowerCase();
  if (texto.includes("electric")) return "ϟ";
  if (texto.includes("gas")) return "♨";
  if (texto.includes("jard")) return "❧";
  if (texto.includes("pint")) return "▥";
  if (texto.includes("carpin")) return "⌑";
  return "⚒";
}