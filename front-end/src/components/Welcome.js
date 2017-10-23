import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router'
import NewerHomePage from "./NewerHomePage";
import Login from "./Login";

class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        handleLogout: PropTypes.func.isRequired
    };

    state = {
        username : ''
    };

    componentWillMount(){
        this.setState({
            username : this.props.username
        });
        //document.title = `Welcome, ${this.state.username} !!`;
    }

    componentDidMount(){
        document.title = `Welcome, ${window.sessionStorage.getItem("key")} !!`;
    }

    render() {
        if (window.sessionStorage.getItem("key")) {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <div className="alert alert-warning" role="alert">
                        {window.sessionStorage.getItem("key")}, welcome to my App..!!
                    </div>
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}>
                        Logout
                    </button>
                </div>
            </div>
        )
    }
    else{
            return(
            <Redirect to ="/"/>
                )
        }
    }
}

export default Welcome;