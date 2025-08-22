import { createContext, useEffect, useReducer, useState} from 'react'
import type { ReactNode } from 'react'
import type { AuthContextValue, AuthReducerAction, AuthReducerState } from './AuthContext.types.ts'
import { useCookies } from 'react-cookie'

export const AuthContext = createContext<AuthContextValue>({
    user: null,
    isReady: false,
    dispatch: () => {}
})

const authReducer = (state: AuthReducerState, action: AuthReducerAction) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, isReady: true }
        case 'UPDATE':
            return { user: action.payload, isReady: true }
        case 'LOGOUT':
            localStorage.removeItem('user')
            return { user: null, isReady: true }
        default:
            return state
    } 
}

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [cookies] = useCookies(['XSRF-TOKEN'])
    const [isReady, setIsReady] = useState(false)
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isReady: isReady
    })

    useEffect(() => {
        setIsReady(true)
        if (cookies['XSRF-TOKEN']) {
            const user = JSON.parse(localStorage.getItem('user') ?? '{}')

            if (user) {
                dispatch({
                    type: 'LOGIN',
                    payload: user
                })
            }
        } else {
            dispatch({
                type: 'LOGOUT',
                payload: null
            })
        }
    }, [cookies])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}