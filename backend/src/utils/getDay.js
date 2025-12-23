export const getLastNDays = (days = 30) => {
  const dates = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    const key = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }); // YYYY-MM-DD
    const formattedDate = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}/${d.getFullYear()}`; // DD/MM/YYYY

    dates.push({ key, formattedDate });
  }

  return dates;
};
