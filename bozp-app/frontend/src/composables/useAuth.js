export function useAuth() {
  function getTokenPayload() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(""),
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function getRole() {
    return getTokenPayload()?.role ?? null;
  }

  function getUserId() {
    return getTokenPayload()?.userId ?? null;
  }

  function getCompanyId() {
    return getTokenPayload()?.companyId ?? null;
  }

  function getFullName() {
    return getTokenPayload()?.fullName ?? null;
  }

  function logout(router) {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return { getRole, getUserId, getCompanyId, getFullName, logout };
}
