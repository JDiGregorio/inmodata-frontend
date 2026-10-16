export function isPasswordAllowed(password: string | null | undefined): boolean {
    if (!password || password.includes('\0')) return false
    return Array.from(password).length >= 15 && new TextEncoder().encode(password).length <= 72
}
