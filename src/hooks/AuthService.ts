type Provider = "spotify" | "genius";

export default function useAuthService(provider: Provider) {
  const bearerKey = "Bearer-" + provider;
  const refreshKey = "Refresh-" + provider;
  const expiresAtKey = "ExpiresAt-" + provider;

  const clear = () => {
    localStorage.removeItem(bearerKey);
    localStorage.removeItem(refreshKey);
  };

  const getBearer = () => {
    return localStorage.getItem(bearerKey);
  };

  const setBearer = (bearerToken: string) => {
    localStorage.setItem(bearerKey, bearerToken);
  };

  const getRefresh = () => {
    return localStorage.getItem(refreshKey);
  };

  const setRefresh = (refreshToken: string) => {
    localStorage.setItem(refreshKey, refreshToken);
  };

  const getExpiresAt = () => {
    const expiresAt = localStorage.getItem(expiresAtKey);
    return expiresAt ? Number(expiresAt) : null;
  };

  /** @param expiresAtTimestamp - timestamp in milliseconds */
  const setExpiresAt = (expiresAtTimestamp: number) => {
    localStorage.setItem(expiresAtKey, String(expiresAtTimestamp));
  };

  const canRefreshToken = () => {
    return !!getRefresh();
  };

  const isTokenExpired = (expiresAtOptional?: number) => {
    const expiresAt = expiresAtOptional ?? Number(getExpiresAt());
    if (isNaN(expiresAt)) return false; // there is not token so technically it cannot be expired

    // minute from now
    return Date.now() + 60000 < expiresAt;
  };

  const isLoggedIn = () => {
    if (!localStorage.getItem(bearerKey)) return false;
    const expiresAt = getExpiresAt();
    if (expiresAt) {
      // minute from now
      return isTokenExpired(Number(expiresAt));
    }
    return true;
  };

  return {
    getBearer,
    setBearer,
    setRefresh,
    getRefresh,
    getExpiresAt,
    setExpiresAt,
    clear,
    isLoggedIn,
    isTokenExpired,
    canRefreshToken,
  };
}
