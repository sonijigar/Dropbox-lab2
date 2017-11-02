import { createStore } from 'redux'
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Navbar from './Navbar'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FileGridList from './FileGridList';
import Upload from 'material-ui-upload/Upload';
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
        payload.append('pathabc', this.state.dirarr)
        var objPath = {patharr:this.state.dirarr}
        API.uploadFile(payload, objPath)
            .then((status) => {
                if (status === 204) {
                     API.getFiles()
                         .then((data) => {
                             this.setState({
                                 files: data.filelist,
                                 dirs: data.dirlist
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

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    createDir = () => {
        this.setState({
            open : false
        })
        var dirobj = {};
        dirobj.name = this.state.dirname
        dirobj.patharr = this.state.dirarr
        API.createDir(dirobj)
            .then((status) => {
                window.location.reload()
            if(status === 200){
                this.setState({
                    dirname : ''
                })
            }
            })
    }

    handleDirClick = (dirname) => {
        var arr = this.state.dirarr;
        arr.push(dirname.dirname);
        API.getFilesFromDir(dirname)
            .then((data) => {;
            this.setState({
                files:data.filelist,
                dirs:data.dirlist,
                dirarr: arr,
                disable:false
            })
                console.log("dirarray:", this.state.dirarr);
            console.log("array:",arr);
            });
    }

    constructor() {
        super();
        this.state = {
            files: [],
            dirs: [],
            username : '',
            open:false,
            dirname : '',
            dirarr:[],
            disable:true,
        };
    }

    componentDidMount(){
        document.title = `Home-Dropbox`;
        API.getFiles()
            .then((data) => {
                console.log(data);
                this.setState({
                    files: data.filelist,
                    dirs: data.dirlist,
                    disable:true
                });
            });
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.createDir}
            />,
        ];

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
                        {/*<strong>email</strong>: {window.sessionStorage.getItem("email")} <br />*/}
                        {/*<strong>phone</strong>: {window.sessionStorage.getItem("phone")} <br />*/}
                        </div>

                        <div style={{float:'center'}}>
                            <div style={{float:'left'}}>
                            <RaisedButton
                            label="<<"
                            style={style}
                            disabled={this.state.disable}
                            type="button"
                            onClick={()=> {
                                var dir = {dirname: this.state.dirarr.pop()}
                                if (this.state.dirarr == 0) {
                                    API.getFiles()
                                        .then((data) => {
                                            console.log(data);
                                            this.setState({
                                                files: data.filelist,
                                                dirs: data.dirlist,
                                                disable:true,
                                            });
                                        });
                                }
                                else{
                                    API.getFilesFromDir(dir)
                                        .then((data) => {
                                            this.setState({
                                                files: data.filelist,
                                                dirs: data.dirlist

                                            })
                                        });
                            }
                            }}
                            />
                            </div>
                            <FileGridList files={this.state.files} dirs={this.state.dirs} handleDirClick={this.handleDirClick}/>
                        </div>
                    </div>

            </div>
                <div style={{float:'top-right'}}>
                    <RaisedButton
                        label="Create Folder"
                        style={style}
                        type="button"
                        onClick={this.handleOpen}
                    />
                    <Dialog
                        title="Name Your Directory"
                        actions={actions}
                        modal={true}
                        open={this.state.open}
                    >
                        <TextField
                        name = "dirname"
                        label = "enter name"
                        value = {this.state.dirname}
                        onChange={(event) => {
                            this.setState({
                                dirname: event.target.value
                            });
                        }}
                        />
                    </Dialog>
                    <RaisedButton
                        label="Logout"
                        style={style}
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}
                    />
                    <Upload
                        // className={'fileupload'}
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