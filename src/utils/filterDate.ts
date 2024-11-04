export const filterDate = (dateTimeStr: string): string => {
  if (!dateTimeStr) {
    throw new Error("Invalid date string provided");
  }

  return dateTimeStr.split("T")[0];
};
