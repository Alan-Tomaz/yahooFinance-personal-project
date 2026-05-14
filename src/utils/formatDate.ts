export const formatDate = (date: Date, language: string = "en-US"): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  if (language === "pt-BR") {
    return `${day}/${month}/${year}`;
  }
  return `${year}-${month}-${day}`;
};
