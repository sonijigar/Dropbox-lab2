import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
const style = {
    margin: 12,
};
class Login extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    state = {
        username: '',
        password: ''
    };

    handleLoad = () => {
        API.doCheck()
            .then((status)=>{
                console.log(status)
                if(status === 201){
                    this.props.history.push("/welcome");
                }
                else{
                    //  <Redirect to="/"/>
                    this.props.history.push("/login");
                }
            })
    }

    componentWillMount(){
        window.addEventListener('load', this.handleLoad);
        this.setState({
            username: '',
            password: ''
        });
    }

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <form>
                        <div className="form-group">
                            <h1>Login</h1>
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.username}
                                onChange={(event) => {
                                    this.setState({
                                        username: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="password"
                                label="password"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <RaisedButton
                                style={style}
                                label="Submit"
                                type="button"
                                onClick={() => this.props.handleSubmit(this.state)}/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);