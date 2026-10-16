import { createContext, useCallback, useEffect, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AuthContextValue, AuthReducerAction, AuthReducerState } from './AuthContext.types.ts'
import { useCookies } from 'react-cookie'
import { advanceSession, onSessionExpired } from '../lib/session'

export const AuthContext = createContext<AuthContextValue>({
    user: null,
    isReady: false,
    dispatch: () => {}
})

const authReducer = (state: AuthReducerState, action: AuthReducerAction) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, isReady: true, sessionVersion: (state.sessionVersion ?? 0) + 1 }
        case 'UPDATE':
            return { ...state, user: action.payload, isReady: true }
        case 'LOGOUT':
            return { user: null, isReady: true, sessionVersion: (state.sessionVersion ?? 0) + 1 }
        default:
            return state
    } 
}

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [cookies] = useCookies(['XSRF-TOKEN'])
    const [state, reduce] = useReducer(authReducer, {
        user: null,
        isReady: false,
        sessionVersion: 0,
    })
    const dispatch = useCallback((action: AuthReducerAction) => {
        if (action.type === 'LOGIN' || action.type === 'LOGOUT') advanceSession()
        if (action.type === 'LOGOUT') localStorage.removeItem('user')
        reduce(action)
    }, [])

    useEffect(() => onSessionExpired(() => dispatch({ type: 'LOGOUT', payload: null })), [dispatch])

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') ?? 'null')
            if (cookies['XSRF-TOKEN'] && user && (typeof user.id === 'string' || typeof user.id === 'number')) {
                dispatch({
                    type: 'LOGIN',
                    payload: user
                })
                return
            }
        } catch { /* Discard malformed persisted profile data. */ }
        dispatch({ type: 'LOGOUT', payload: null })
    }, [cookies, dispatch])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}
