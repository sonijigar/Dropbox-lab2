import { createStore } from 'redux'
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Divider from 'material-ui/Divider';
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

    handleNavFile = () => {
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

    handleOpen2 = (lst) => {
        console.log("lst", lst)
        this.setState({
            open2: true,

        });
    };

    handleClose2 = () => {
        this.setState({
            open2: false,
        });
    };

    handleOpen1 = (lst) => {
        console.log("lst", lst)
        this.setState({
            open1: true,
            sharename:lst
        });
    };

    handleClose1 = () => {
        this.setState({
            open1: false,
            sharename:''
        });
    };

    handleShareholderNameChange = (idx) => (evt) => {
        const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
            if (idx !== sidx) return shareholder;
            return { ...shareholder, email: evt.target.value };
        });

        this.setState({ shareholders: newShareholders });
    }

    handleSubmit = (evt) => {
        const { name, shareholders } = this.state;
        alert(`Incorporated: ${name} with ${shareholders.length} shareholders`);
    }

    handleAddShareholder = () => {
        this.setState({ shareholders: this.state.shareholders.concat([{ email: '' }]) });
    }

    handleRemoveShareholder = (idx) => () => {
        this.setState({ shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx) });
    }

    handleGroupCreation = () => {
        this.setState({
            open:false,

        })
        console.log(this.state.shareholders)
        var isname = this.state.sharename;
        console.log("isname",isname)
        var body = {
            name: this.state.sharename,
            holders:this.state.shareholders
        }
        console.log(body)
        API.createGroup(body)
            .then((res)=>{
                if(res == 201){
                    console.log("email added")
                }
                else{
                    console.log("email not added")
                }
            })
    }

    createSharedDir = () => {
        this.setState({
            open2:false,

        })
        console.log(this.state.shareholders)
        var isname = this.state.newdirname;
        console.log("isname")
        var body = {
            newdirname: this.state.newdirname,
            holders:this.state.shareholders
        }
        console.log(body)
        API.createSharedGroup(body)
            .then((res)=>{
                if(res == 201){
                    console.log("email added")
                }
                else{
                    console.log("email not added")
                }
            })
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
            open1:false,
            open2:false,
            shareholders: [{email: '' }],
            sharename:'',
            newdirname:'',
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

        const actions1 = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose1}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.handleGroupCreation}
            />,
        ];

        const actions2 = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose2}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.createSharedDir}
            />,
        ];

        if (window.sessionStorage.getItem("key")) {
        return (
            <div>
                <div style={{float: 'left', width:'22%', height:'100%   '}}>
                <Navbar handleNavFile={this.handleNavFile}/>
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
                            <strong><h1>Dropbox</h1></strong>
                        {/*<strong>email</strong>: {window.sessionStorage.getItem("email")} <br />*/}
                        {/*<strong>phone</strong>: {window.sessionStorage.getItem("phone")} <br />*/}
                        </div>

                        <div style={{float:'center'}}>
                            <div style={{float:'left'}}>
                            <RaisedButton
                            style={style}
                            label="<"
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
                            </div><br/>
                            <FileGridList files={this.state.files} dirs={this.state.dirs} handleDirClick={this.handleDirClick}/>
                        </div>
                    </div>

            </div>
                <div style={{float:'top-right'}} >
                    &nbsp;
                    &nbsp;
                    <strong>
                        {window.sessionStorage.getItem("key")}
                    </strong><RaisedButton
                    label="Logout"
                    style={style}
                    type="button"
                    onClick={() => this.props.handleLogout(this.state)}
                />
                    <RaisedButton
                        label="Create Shared Folder"
                        style={style}
                        primary={true}
                        type="button"
                        onClick={this.handleOpen2}
                    /><br/>
                    <RaisedButton
                        label="Create Folder"
                        style={style}
                        primary={true}
                        type="button"
                        onClick={this.handleOpen}
                    /><br/>
                    <RaisedButton
                        label="Create Grpoup"
                        style={style}
                        type="button"
                        onClick={this.handleOpen1}
                    /><br/>

                    <Dialog
                        title="Name your shared folder"
                        actions={actions2}
                        modal={true}
                        open={this.state.open2}
                    >
                        {/*{this.state.email.map((email, idx)=>(*/}
                        {/*<div>*/}
                        {/*<TextField*/}
                        {/*name = "email"*/}
                        {/*label = "enter email"*/}
                        {/*value = {email}*/}
                        {/*onChange={(event) => {*/}
                        {/*this.setState({*/}
                        {/*email: event.target.value*/}
                        {/*});*/}
                        {/*}}*/}
                        {/*/>*/}
                        {/*&nbsp;*/}
                        {/*&nbsp;*/}
                        {/*<RaisedButton primary={false} onClick>+</RaisedButton>*/}
                        {/*</div>*/}
                        {/*))}*/}
                        <input
                            type="text"
                            value = {this.state.newdirname}
                            onChange={(event) => {
                                this.setState({
                                    newdirname: event.target.value
                                });
                            }}
                        /><br/>
                        <Divider/>
                        <strong>Share with:</strong>
                        {this.state.shareholders.map((shareholder, idx) => (
                            <div className="shareholder">
                                <TextField
                                    type="text"
                                    placeholder={`person #${idx + 1}`}
                                    value={shareholder.email}
                                    onChange={this.handleShareholderNameChange(idx)}
                                />
                                &nbsp;
                                &nbsp;
                                <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                            </div>
                        ))}


                        <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                    </Dialog>

                    <Dialog
                        title="Enter email"
                        actions={actions1}
                        modal={true}
                        open={this.state.open1}
                    >
                        {/*{this.state.email.map((email, idx)=>(*/}
                        {/*<div>*/}
                        {/*<TextField*/}
                        {/*name = "email"*/}
                        {/*label = "enter email"*/}
                        {/*value = {email}*/}
                        {/*onChange={(event) => {*/}
                        {/*this.setState({*/}
                        {/*email: event.target.value*/}
                        {/*});*/}
                        {/*}}*/}
                        {/*/>*/}
                        {/*&nbsp;*/}
                        {/*&nbsp;*/}
                        {/*<RaisedButton primary={false} onClick>+</RaisedButton>*/}
                        {/*</div>*/}
                        {/*))}*/}

                        {this.state.shareholders.map((shareholder, idx) => (
                            <div className="shareholder">
                                <TextField
                                    type="text"
                                    placeholder={`person #${idx + 1}`}
                                    value={shareholder.email}
                                    onChange={this.handleShareholderNameChange(idx)}
                                />
                                &nbsp;
                                &nbsp;
                                <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                            </div>
                        ))}


                        <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                    </Dialog>

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