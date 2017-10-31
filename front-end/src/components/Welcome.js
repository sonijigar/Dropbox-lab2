import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Navbar from './Navbar'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FileGridList from './FileGridList'
const style = {
    margin: 12,
};

class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        handleLogout: PropTypes.func.isRequired
    };

    // onBackButtonEvent = () => {
    //     e.preventDefault();
    //     if(true){
    //         window.history.go(0);
    //     }else {
    //         window.history.forward();
    //     }
    // }
    //
    // onBackButtonEvent = () => {
    //     API.doCheck()
    //         .then((status)=>{
    //             console.log(status)
    //             if(status === 201){
    //                 this.props.history.go(0);
    //             }
    //             else{
    //                 //  <Redirect to="/"/>
    //                 this.props.history.push("/login");
    //             }
    //         })
    // }

    handleFileUpload = (event) => {
        const payload = new FormData();

        payload.append('file', event.target.files[0]);

        API.uploadFile(payload)
            .then((status) => {
                if (status === 204) {
                     API.getFiles()
                         .then((data) => {
                             this.setState({
                                 files: data
                             });
                         });
                    console.log("file sent");
                }
            });
}
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
    constructor() {
        super();
        this.state = {
            files: [],
            username : ''
        };
    }

    // state = {
    //     username : ''
    // };

    componentWillMount(){
        window.addEventListener('load', this.handleLoad);
        //window.addEventListener('popstate',this.onBackButtonEvent);
        this.setState({
            username : this.props.username
        });
        //document.title = `Welcome, ${this.state.username} !!`;
    }

    componentDidMount(){
        document.title = `Home-Dropbox`;
        API.getFiles()
            .then((data) => {
                console.log(data);
                this.setState({
                    files: data
                });
            });
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
                        <div>
                            <FileGridList files={this.state.files}/>
                        </div>
                    </div>

            </div>
                <div style={{float:'right'}}>
                    <RaisedButton
                        label="Logout"
                        style={style}
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}/>

                    <TextField
                        className={'fileupload'}
                        type="file"
                        name="mypic"
                        onChange={this.handleFileUpload}
                    />

                </div>
            </div>
        )
    }
    else{
            return(
            //<Redirect to ="/"/>
                this.props.history.push("/")
                )
        }
    }
}

export default withRouter(Welcome);