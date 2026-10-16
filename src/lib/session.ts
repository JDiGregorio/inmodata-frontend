const expiredEvent = 'inmodata:session-expired'
let generation = 0

export const sessionGeneration = () => generation
export const advanceSession = () => ++generation

export function expireSession(expectedGeneration = generation) {
    if (expectedGeneration !== generation) return
    localStorage.removeItem('user')
    window.dispatchEvent(new Event(expiredEvent))
}

export function onSessionExpired(listener: () => void) {
    window.addEventListener(expiredEvent, listener)
    return () => window.removeEventListener(expiredEvent, listener)
}

export const isExpiredStatus = (status: unknown) => status === 401 || status === 419
