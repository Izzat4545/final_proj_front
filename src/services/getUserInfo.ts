export const getUserInfo = async (BASE_URL: string, token: string) => {
  const getUser = await fetch(BASE_URL + "/settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return getUser;
};
