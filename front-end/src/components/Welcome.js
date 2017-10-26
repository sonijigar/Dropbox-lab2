import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router'
import * as API from '../api/API';
import Navbar from './Navbar'
import RaisedButton from 'material-ui/RaisedButton';
const style = {
    margin: 12,
};

class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        handleLogout: PropTypes.func.isRequired
    };
    //
    // handleLoad = () => {
    //     API.doCheck()
    //         .then((status)=>{
    //         if(status === 201){
    //             this.props.history.push('/welcome')
    //         }
    //         })
    // }

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
        // window.addEventListener('load', this.handleLoad);
        document.title = `Home-Dropbox`;
    }

    render() {
        if (window.sessionStorage.getItem("key")) {
        return (
            <div>
                <div style={{float: 'left', width:'22%', height:'100%   '}}>
                <Navbar/>
                </div>
            <div style={{float:'left', width:'55%'}}>
                    <div role="alert">
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                        <div >
                            <strong>username</strong>: {window.sessionStorage.getItem("key")}<br />
                        <strong>email</strong>: {window.sessionStorage.getItem("email")} <br />
                        <strong>phone</strong>: {window.sessionStorage.getItem("phone")} <br />
                        </div>
                    </div>

            </div>
                <div style={{float:'right'}}>
                    <RaisedButton
                        label="Logout"
                        style={style}
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}/>

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