export const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = import.meta.env[key];
  if (typeof value === "undefined" || value === "") {
    return defaultValue;
  }
  return value;
};
