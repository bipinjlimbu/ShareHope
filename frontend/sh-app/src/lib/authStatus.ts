const AUTH_STATUS_KEY = "sharehope_authenticated";

export function getAuthStatus(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    return sessionStorage.getItem(AUTH_STATUS_KEY) === "true";
}

export function setAuthStatus(authenticated: boolean): void {
    if (typeof window === "undefined") {
        return;
    }

    if (authenticated) {
        sessionStorage.setItem(AUTH_STATUS_KEY, "true");
    } else {
        sessionStorage.removeItem(AUTH_STATUS_KEY);
    }

    window.dispatchEvent(
        new CustomEvent("auth-change", {
            detail: { authenticated },
        })
    );
}