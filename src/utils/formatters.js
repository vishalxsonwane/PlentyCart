export const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

export const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date";
  try {
    // Split the DD/MM/YYYY string into parts
    const [day, month, year] = dateString.split("/").map(Number);

    // Validate that the parts are numbers and within valid ranges
    if (!day || !month || !year || day > 31 || month > 12) {
      return "Invalid Date";
    }

    // Create a new Date object using the parsed values
    const date = new Date(year, month - 1, day); // Month is zero-indexed in JS Date

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

export const formatDateTime = (date, time) => {
  return `${formatDate(date)} ${time}`;
};