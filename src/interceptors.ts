import axios from 'axios'
import { expireSession, isExpiredStatus, sessionGeneration } from './lib/session'

const APP_ENV = import.meta.env.APP_ENV

const setupInterceptors = () => {
    const generations = new WeakMap<object, number>()
    axios.defaults.withCredentials = true
    axios.defaults.withXSRFToken = true

    axios.interceptors.request.use(
        (config) => {
            generations.set(config, sessionGeneration())
            if (APP_ENV === "production") {
                if (config.url?.startsWith('http://')) {
                    config.url = config.url.replace('http://', 'https://')
                }

                if (config.baseURL?.startsWith('http://')) {
                    config.baseURL = config.baseURL.replace('http://', 'https://')
                }
            }

            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axios.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (isExpiredStatus(error.response?.status) && error.config && generations.has(error.config)) {
                expireSession(generations.get(error.config))
            }

            return Promise.reject(error)
        }
    )
}

export default setupInterceptors
