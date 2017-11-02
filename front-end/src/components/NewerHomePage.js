import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import Signup from "./Signup";
import Land from "./Land";
import Signed from "./Signed"
import RaisedButton from 'material-ui/RaisedButton';
    const style = {
        margin: 12,
    };
class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: ''
    };

    handleSignUp = (userdata) => {
        console.log("here")
        API.doSignUp(userdata)
            .then((status) => {
                if (status.stat === "logged in") {
                    console.log(status);
                    window.sessionStorage.setItem("email", status.email);
                    window.sessionStorage.setItem("phone", status.phone)
                    window.sessionStorage.setItem("key", status.username);
                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to my App..!!",
                        username: userdata.username,
                        email: userdata.email,
                        phone: userdata.phone
                    });

                    this.props.history.push("/signedup");
                } else {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleSubmit = (userdata) => {
        API.doLogin(userdata)
            .then((status) => {
                if (status.stat === 'logged in') {
                    console.log("here");
                    window.sessionStorage.setItem("email", status.email);
                    window.sessionStorage.setItem("phone", status.phone)
                    window.sessionStorage.setItem("key", status.username);

                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to my App..!!",
                        username: userdata.username
                    });

                    this.props.history.push("/welcome");
                } else {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleLogout = () => {
        console.log('logout called');
        API.logout()
            .then((status) => {
                if(status === 200){

                    this.props.history.push("/");
                }
            });
    };


    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>
                        <Land/>
                        <Message message=""/>
                        <RaisedButton style={style} label = "Login" onClick={() => {
                            this.props.history.push("/login");
                        }}/>
                        <RaisedButton label="Sign Up" onClick={() => {
                            this.props.history.push("/signup");
                        }}/>
                    </div>
                )}/>
                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup handleSignUp={this.handleSignUp}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <Welcome handleLogout={this.handleLogout} username={this.state.username}/>
                )}/>

                <Route exact path="/signedup" render={() => (
                    <Signed />
                )}/>

            </div>
        );
    }
}

export default withRouter(NewerHomePage);