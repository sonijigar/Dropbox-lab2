import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
const style = {
    margin: 12,
};
class Signup extends Component {

    static propTypes = {
        handleSignUp: PropTypes.func.isRequired
    };

    state = {
        username: '',
        password: '',
        email: '',
        phone:''
    };

    componentWillMount(){
        this.setState({
            username: '',
            password: '',
            email: '',
            phone:''
        });
    }

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <form>
                        <div className="form-group">
                            <h1>Sign Up</h1>
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
                                type="text"
                                label="Email"
                                placeholder="Enter Email"
                                value={this.state.email}
                                onChange={(event) => {
                                    this.setState({
                                        email: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Phone number"
                                placeholder="Enter Phone"
                                value={this.state.phone}
                                onChange={(event) => {
                                    this.setState({
                                        phone: event.target.value
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
                                label="submit"
                                style={style}
                                type="button"
                                onClick={() => this.props.handleSignUp(this.state)}/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;