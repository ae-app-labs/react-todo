import axios from "axios"
import { API_URL, JPA_API_URL } from "../../Constants";

class TodoDataService {

    retrieveAllTodos(name) {
        //let username = 'silverback'
        //let password = 'test'

        //let basicAuthHeader = 'Basic ' + window.btoa(username + ":" + password)

        return axios.get(`${JPA_API_URL}/users/${name}/todos`);
    }

    deleteTodo(name, id){
        return axios.delete(`${JPA_API_URL}/users/${name}/todos/${id}`)
    }
}

export default new TodoDataService()