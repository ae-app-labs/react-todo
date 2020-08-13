import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import HelloWorldService from '../../api/todo/HelloWorldService'
import TodoDataService from '../../api/todo/TodoDataService'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthenticationService from '../../api/todo/AuthenticationService';

class TodoApp extends Component {
    render(){
        return (
            <div className="TodoApp container">
                <header>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                        <a className="nav-item nav-link active" href="#">Home</a>
                        <a className="nav-item nav-link" href="#">Features</a>
                        <a className="nav-item nav-link" href="#">Pricing</a>
                        <a className="nav-item nav-link disabled" href="#">Disabled</a>
                        </div>
                    </div>
                    </nav>
                </header>
                <Router>
                    <>
                        <Switch>
                            
                            <Route path="/login" component={LoginComponent} />
                            <Route path="/welcome" component={WelcomeComponent} />
                            <Route path="/todos" component={ListTodosComponent} />
                            <Route component={ErrorComponent} />
                        </Switch>
                    </>
                </Router>
                
            </div>
        )
    }
}

class LoginComponent extends Component {
    constructor(props){
        super(props)
    
        this.state = {
            username: 'silverback',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: false
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)
    }

    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    loginClicked(event){
        /*AuthenticationService.executeBasicAuthService(this.state.username, this.state.password)
            .then(
                () => {
                    AuthenticationService.registerSuccessfulLogin()
                    this.props.history.push("/welcome")
                }
            )
            .catch( () => {
                this.setState({hasLoginFailed: true})
                this.setState({showSuccessMessage: false})
            })
        */

       AuthenticationService.executeJWTAuthService(this.state.username, this.state.password)
       .then(
           (response) => {
               AuthenticationService.registerSuccessfulLoginJwt(this.state.username, response.data.token)
               this.props.history.push("/welcome")
           }
       )
       .catch( () => {
           this.setState({hasLoginFailed: true})
           this.setState({showSuccessMessage: false})
       })

        /* if(this.state.username === 'silverback' && this.state.password === 'test'){
            this.props.history.push("/welcome")
            //this.setState({showSuccessMessage: true})
            //this.setState({hasLoginFailed: false})
        } else {
            this.setState({hasLoginFailed: true})
            this.setState({showSuccessMessage: false})
        }*/
    }
   

    render() {
      return (
        <div>
            <br />

            {this.state.hasLoginFailed && <div className="alert alert-danger">Invalid Credentials</div>}
            {this.state.showSuccessMessage && <div>Login Successful</div>} 

            Username: <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange}/>
            Password: <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange}/>
            <button onClick={this.loginClicked}>Login</button>
        </div>
      )
    }
  }

  class ListTodosComponent extends Component{
      constructor(props){
        super(props)
        this.state = {
            todos: [],
            message: null
        }

        
      }

      componentDidMount() {
        TodoDataService.retrieveAllTodos('in28minutes')
        .then( response => {
            console.log(response.data);

            this.setState({
                todos: response.data
            })
        } )
        .catch( (err) => console.log(err) )
      }

      deleteTodoClicked = (id) => {
        let username = "Suresh"
        TodoDataService.deleteTodo(username, id)
            .then( response => {
                console.log(response.data);
                TodoDataService.retrieveAllTodos('suresh')
                .then( response => {
                    console.log(response.data);
        
                    this.setState({
                        todos: response.data
                    })
                } )
                .catch( (err) => console.log(err) )
                
                this.setState({ message: `Deleted todo with id ${id} successfuly` })
                
            })
            .catch( (err) => console.log(err) )
      }

      render(){
          return (
                <div>
                    <h1>List of Todos</h1>
                    {this.state.message &&  <div className="alert alert-secondary">{this.state.message}</div>}

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th>Description</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.todos.map( (todo) => 
                                <tr key={todo.id}>
                                    <td>{todo.id}</td>
                                    <td>{todo.desc}</td>
                                    <td><button className="btn btn-warning" onClick={ () => this.deleteTodoClicked(todo.id)}>Delete</button></td>
                                </tr>)
                            }
                        </tbody>
                    </table>
              </div>
          )
      }
  }

class WelcomeComponent extends Component {
    constructor(){
        super()

        this.state = {
            welcomeMessage: ""
        }
    }

    render(){
        return (
            <>
                <h1>Welcome</h1>
                <div>Welcome to this page</div>
                <div className="alert alert-primary">
                    {this.state.welcomeMessage}
                </div>

                <div>
                    <Link to='/welcome'>Welcome</Link> <br />
                    <Link to='/todos'>List Todos</Link> <br />
                    <button onClick={this.retrieveWelcomeMessage}>Get Welcome Message</button>
                </div>
            </>
        )
    }

    retrieveWelcomeMessage = () => {
        AuthenticationService.registerSuccessfulLogin()

        console.log("retrieveWelcomeMessage clicked")
        HelloWorldService.executeHelloWorldPathVarService("suresh")
            .then( response => this.handleSuccessResponse(response) )
            .catch( err => console.log( err ))
    }

    handleSuccessResponse = (response) => {
        this.setState({
            welcomeMessage: response.data.message
        })
    }
}

function ErrorComponent(){
    return (
        <div>
            An Error Occured. <br/>
            Click here to navigate to <Link to={"/welcome"}>welcome page</Link>
            <br/>
            Click here to <Link to={"/login"}>login</Link>
        </div>
    )
}

export default TodoApp