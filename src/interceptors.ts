import axios from 'axios'
import { expireSession, isExpiredStatus, sessionGeneration } from './lib/session'

const setupInterceptors = () => {
    const generations = new WeakMap<object, number>()
    axios.defaults.withCredentials = true
    axios.defaults.withXSRFToken = true

    axios.interceptors.request.use(
        (config) => {
            generations.set(config, sessionGeneration())
            // The page's transport, not a build-time label, determines mixed-content safety.
            if (window.location.protocol === 'https:') {
                if (config.url) {
                    config.url = config.url.replace(/^http:\/\//i, 'https://')
                }

                if (config.baseURL) {
                    config.baseURL = config.baseURL.replace(/^http:\/\//i, 'https://')
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
