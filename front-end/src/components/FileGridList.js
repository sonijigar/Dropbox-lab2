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
        handleDirClick: PropTypes.func.isRequired
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
    handleOpen = (lst) => {
        console.log("lst", lst)
        this.setState({
            open: true,
            sharename:lst
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
        };
    }

    componentWillMount(){
        console.log("fileprops:", this.props.files)
    }


    render() {
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
        // if (this.props.dirs == null && this.props.files == null) {
        //     return (
        //         <div></div>
        //     )
        // }
        // else{
            return (
                <div className={classes.root}>
                    <List>
                        <div>
                        <Subheader inset={true} >Folders</Subheader>
                            <br />
                        </div>
                            {this.props.dirs.map(lst => (
                            <div>
                                <ListItem
                                    leftAvatar={<Avatar icon={<FileFolder/>}/>}
                                    rightIconButton={<IconMenu
                                        iconButtonElement={<IconButton><MoreVertIcon tooltipPosition="bottom-center"/><IconButton touch={true} tooltipPosition="bottom-center">
                                            <ActionGrade />
                                        </IconButton></IconButton>                                        }
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}

                                    >
                                        <MenuItem primaryText="Download"/>
                                        <MenuItem primaryText="Share" onClick={() => {console.log("list", lst);this.handleOpen(lst)}}/>
                                        <MenuItem primaryText="Delete" onClick={(event) => {
                                            var ob = {name: lst}
                                            API.deleteDir(ob)
                                                .then((res) => {
                                                    if (res.status == 200) {
                                                        window.location.reload();
                                                    }

                                                })
                                        }}/>
                                    </IconMenu>}
                                    primaryText={lst}

                                    onClick={() => {
                                        var obj = {dirname: lst}
                                        console.log("it is clicked")
                                        this.props.handleDirClick(obj)
                                    }}
                                />
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
                    <List>
                        <Subheader inset={true}>Files</Subheader>
                        {this.props.files.map(lst => (
                            <div>
                                <ListItem
                                    leftAvatar={<Avatar icon={<ActionAssignment/>}/>}
                                    rightIcon={<IconMenu
                                        iconButtonElement={<IconButton><MoreVertIcon/> <IconButton tooltip="bottom-right" touch={true} tooltipPosition="bottom-right">
                                            <ActionGrade />
                                        </IconButton> </IconButton>}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    >
                                        <MenuItem primaryText="Download" onClick={(event) => {

                                            var ob = {name: lst}
                                            API.downloadFile(ob)
                                                .then((res) => {
                                                    console.log("clicked", Buffer.from(res.data));
                                                    fileDownload(Buffer.from(res.data.data), res.name);
                                                })
                                        }}/>
                                        <MenuItem primaryText="Share" onClick={() => {console.log("list", lst);this.handleOpen(lst)}}/>
                                        <MenuItem primaryText="Delete" onClick={(event) => {
                                            var ob = {name: lst}
                                            API.deleteFile(ob)
                                                .then((res) => {
                                                    if (res.status == 200) {
                                                        window.location.reload();
                                                    }

                                                })
                                        }}/>
                                    </IconMenu>}
                                    primaryText={lst}
                                />
                                <Divider inset={true}/>
                            </div>
                        ))}
                    </List>

                </div>
            );
    //}
    }


}


export default withRouter(FileGridList);