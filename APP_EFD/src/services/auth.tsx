export function getUUIDCurrentUser(): string | null {
    return localStorage.getItem('uuid');
}

export function getRoleCurrentUser(): string | null {
    return localStorage.getItem('rol');
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('uuid');
    localStorage.removeItem('nombres');
}

export function getNamesCurrentUser(): string | null {
    return localStorage.getItem('nombres');
}