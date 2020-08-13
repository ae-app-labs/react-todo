import axios from "axios"

class HelloWorldService {
    executeHelloWorldService(){
        console.log("invoke webservice")
        return axios.get('http://localhost:8080/hello-world')
    }

    executeHelloWorldBeanService(){
        console.log("invoke webservice")
        return axios.get('http://localhost:8080/hello-world-bean')
    }

    executeHelloWorldPathVarService(name){

        console.log("invoke webservice")
        return axios.get(`http://localhost:8080/hello-world-bean/path/${name}`)
    }

}

export default new HelloWorldService()