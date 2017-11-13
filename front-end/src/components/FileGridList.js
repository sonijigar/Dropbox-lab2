import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import * as API from '../api/API';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import TextField from 'material-ui/TextField';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import fileDownload from 'react-file-download';
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    subheader: {
        width: '100%',
    },
});

class FileGridList extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        files: PropTypes.array.isRequired,
        dirs: PropTypes.array.isRequired,
        handleDirClick: PropTypes.func.isRequired,
        getFiles: PropTypes.func.isRequired
    };

    handleShare = () => {
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
        API.shareFile(body)
            .then((res)=>{
            if(res == 201){
                console.log("email added")
            }
            else{
                console.log("email not added")
            }
            })
    }

    //var arrr = this.props.files
    handleOpen = (name) => {
        console.log("lst", name)
        this.setState({
            open: true,
            sharename:name
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
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

    constructor() {
        super();
        this.state = {
            files:[],
            dirs:[],
            shareholders: [{email: '' }],
            sharename:'',
            col:true,
        };
    }

    componentWillMount(){
        console.log("fileprops:", this.props.files)
    }


    render() {
        let button = null;
        if(this.state.col ) {
            button = <ActionGrade onClick={() => {
                console.log("star");
                this.setState({col: false})
            }} style={{float: 'left', margin: '20px', color: '000FF'}}/>
        }
        else{
            <ActionGrade onClick={() => {
                console.log("star");
                this.setState({col: false})
            }} style={{float: 'left', margin: '20px', color: '000'}}/>
        }

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Share"
                primary={true}
                onClick={this.handleShare}
            />,
        ];

        const classes = this.props;
        if (this.props.dirs == undefined && this.props.files == undefined) {
            return (
                <div><h2>No files or directory exists<br/><br/>
                        Drag and drop folders here
                </h2>
                </div>
            )
        }
        else{
            return (
                <div className={classes.root}>
                    <List>
                        <div>
                        <Subheader inset={true} >Folders</Subheader>
                            <br />
                        </div>
                            {this.props.dirs.map(lst => (
                            <div>
                                <ListItem style={{float:'left', width:'60%', height:'100%'}}
                                    leftAvatar={<Avatar icon={<FileFolder/>}/>}
                                    onClick={() => {
                                        var obj = {dirname: lst.name}
                                        console.log("it is clicked")
                                        console.log(obj)
                                        this.props.handleDirClick(obj)
                                    }}
                                >
                                    <div style={{float:'left', width:'50%', height:'100%'}}>
                                        {lst.name}
                                    </div>
                                </ListItem>
                                <IconMenu style={{float:'right', marginHight:'20px'}}
                                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>                                        }
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}

                                >
                                    <MenuItem primaryText="Download"/>
                                    <MenuItem primaryText="Share" onClick={() => {console.log("list", lst);this.handleOpen(lst.name)}}/>
                                    <MenuItem primaryText="Delete" onClick={(event) => {
                                        var ob = {name: lst.name}
                                        API.deleteDir(ob)
                                            .then((res) => {
                                                if (res.status == 200) {
                                                    window.location.reload();
                                                }

                                            })
                                    }}/>
                                </IconMenu>
                                <div style={{float:'left', height:'100%'}}>
                                    {/*<ActionGrade style={{float: 'left', margin: '20px', color:'000'}} onClick={()=>{console.log("clickkk")}}/>*/}
                                    { lst.star
                                        ?<ActionGrade onClick={() => {
                                            console.log("star");
                                            this.setState({col: false})
                                            var ob = {name: lst.name, val:"unstar"}
                                            API.starFile(ob)
                                                .then(res => {
                                                    console.log("starred successfully")
                                                })
                                            this.props.getFiles;
                                        }} style={{float: 'left', margin: '20px', color: '000FF'}}/>

                                        :<ActionGrade onClick={() => {

                                            console.log("star");
                                            this.setState({col: true})
                                            var ob = {name: lst.name, val:"star"}
                                            API.starFile(ob)
                                                .then(res => {
                                                    console.log("starred successfully")
                                                })
                                            this.props.getFiles;
                                        }} style={{float: 'left', margin: '20px', color:'000'}}/>
                                    }
                                </div>
                                <Dialog
                                    title="Enter email"
                                    actions={actions}
                                    modal={true}
                                    open={this.state.open}
                                >
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
                                <Divider inset={true}/>
                            </div>
                        ))}
                    </List>
                    <div style={{position:'relative', marginTop:'200px'}}>
                    <List>

                        <Subheader inset={true}>Files</Subheader>
                        {this.props.files.map(lst => (
                            <div>
                                <div >
                                <ListItem style={{float:'left', width:'60%', height:'100%'}}
                                    leftAvatar={<Avatar icon={<ActionAssignment/>}/>}


                                ><div style={{float:'left', width:'50%', height:'100%'}}>
                                    {lst.name}

                                </div>

                                </ListItem>
                                    <IconMenu style={{float:'right', marginHight:'20px'}}
                                        iconButtonElement={<IconButton><MoreVertIcon/> </IconButton>}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    >
                                        <MenuItem primaryText="Download" onClick={(event) => {

                                            var ob = {name: lst.name}
                                            API.downloadFile(ob)
                                                .then((res) => {
                                                    console.log("clicked", Buffer.from(res.data));
                                                    fileDownload(Buffer.from(res.data.data), res.name);
                                                })
                                        }}/>
                                        <MenuItem primaryText="Share" onClick={() => {this.handleOpen(lst.path+lst.name)}}/>
                                        <MenuItem primaryText="Delete" onClick={(event) => {
                                            var ob = {name: lst.name}
                                            API.deleteFile(ob)
                                                .then((res) => {
                                                    if (res.status == 200) {
                                                        window.location.reload();
                                                    }

                                                })
                                        }}/>
                                    </IconMenu>
                                    {/*{button}*/}

                                    { lst.star
                                    ?<ActionGrade onClick={() => {
                                        console.log("star");
                                        this.setState({col: false})
                                        var ob = {name: lst.name, val:"unstar"}
                                        API.starFile(ob)
                                            .then(res => {
                                                console.log("starred successfully")
                                            })
                                        this.props.getFiles;
                                    }} style={{float: 'left', margin: '20px', color: '000FF'}}/>

                                    :<ActionGrade onClick={() => {

                                            console.log("star");
                                            this.setState({col: true})
                                            var ob = {name: lst.name, val:"star"}
                                            API.starFile(ob)
                                                .then(res => {
                                                    console.log("starred successfully")
                                                })
                                            this.props.getFiles;
                                        }} style={{float: 'left', margin: '20px', color:'000'}}/>
                                    }
                                    <div>
                                    <Divider inset={true}/>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </List>
                    </div>

                </div>
            );
    }
    }


}


export default withRouter(FileGridList);