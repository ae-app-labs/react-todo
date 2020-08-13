import axios from "axios"
import { API_URL } from "../../Constants"

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'

class AuthenticationService {

    executeBasicAuthService(username, password){
        
        return axios.get(`${API_URL}/basicauth`,{
            headers : {
                authorization: this.createBasicAuthToken(username, password)
            }
        }).then()

    }

    executeJWTAuthService(username, password){
        return axios.post(`${API_URL}/authenticate`, {
            username,
            password
        })
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    registerSuccessfulLogin(){
        let username = 'silverback'
        let password = 'test'

        let basicAuthHeader = this.createBasicAuthToken(username, password)

        this.setupAxiosIterceptors(basicAuthHeader);
    }

    registerSuccessfulLoginJwt(username, token){
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setupAxiosIterceptors(this.createJWTToken(token))
    }

    createJWTToken(token){
        return 'Bearer ' + token
    }

    setupAxiosIterceptors(basicAuthHeader) {

        axios.interceptors.request.use(
            (config) => {
                // if isUserLoggedIn
                config.headers.authorization = basicAuthHeader
                return config
            }
        )
    }

}

export default new AuthenticationService()