export function getAuth() {
    try {
        return JSON.parse(localStorage.getItem("auth") || "null");
    } catch {
        return null;
    }
}

export function hasPermission(perm) {
    const auth = getAuth();
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return Array.isArray(auth.permissions) && auth.permissions.includes(perm);
}
