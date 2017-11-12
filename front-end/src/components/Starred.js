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


class StarredFileList extends Component {
    static propTypes = {
        //classes: PropTypes.object.isRequired,
        files: PropTypes.array.isRequired,
        dirs: PropTypes.array.isRequired,
        activity:PropTypes.array.isRequired
    };


    constructor() {
        super();
        this.state = {
            groups:[],
            dirs:[],
            shareholders: [{email: '' }],
            sharename:'',
        };
    }

    render(){
        const classes = this.props;

        if (this.props.files == undefined) {
            return (
                <div><h2>WELCOME<br/><br/>
                </h2>
                </div>
            )
        }
        else {
            return (
                <div className={classes.root}>
                    <List>
                        <div style={{float:'left'}}>
                            <Subheader inset={true}><h3>Starred Files</h3></Subheader>
                            <br/>
                        </div>
                        <div style={{margin:30}}>
                        {this.props.files.map(lst => (
                            <div>
                                <ListItem
                                    //leftAvatar={<Avatar icon={<FileFolder/>}/>}
                                    leftAvatar={<Avatar icon={<ActionAssignment/>}/>}
                                    rightIconButton={<IconMenu
                                        iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}

                                    >
                                        <MenuItem primaryText="Download" onClick={(event) => {

                                            var ob = {name: lst}
                                            API.downloadFile(ob)
                                                .then((res) => {
                                                    //console.log("clicked", Buffer.from(res.data));
                                                    fileDownload(Buffer.from(res.data.data), res.name);
                                                })
                                        }}/>
                                        {/*<MenuItem primaryText="Share" onClick={() => {console.log("list", lst);this.handleOpen(lst)}}/>*/}
                                        {/*<MenuItem primaryText="Delete" onClick={(event) => {*/}
                                        {/*var ob = {name: lst}*/}
                                        {/*API.deleteDir(ob)*/}
                                        {/*.then((res) => {*/}
                                        {/*if (res.status == 200) {*/}
                                        {/*window.location.reload();*/}
                                        {/*}*/}

                                        {/*})*/}
                                        {/*}}/>*/}
                                    </IconMenu>}
                                    primaryText={lst}

                                    // onClick={() => {
                                    //     var obj = {dirname: lst}
                                    //     console.log("it is clicked")
                                    //     this.props.handleDirClick(obj)
                                    // }}
                                />
                                {/*<Dialog*/}
                                {/*title="Enter email"*/}
                                {/*actions={actions}*/}
                                {/*modal={true}*/}
                                {/*open={this.state.open}*/}
                                {/*>*/}
                                {/*{this.state.shareholders.map((shareholder, idx) => (*/}
                                {/*<div className="shareholder">*/}
                                {/*<TextField*/}
                                {/*type="text"*/}
                                {/*placeholder={`person #${idx + 1}`}*/}
                                {/*value={shareholder.email}*/}
                                {/*onChange={this.handleShareholderNameChange(idx)}*/}
                                {/*/>*/}
                                {/*&nbsp;*/}
                                {/*&nbsp;*/}
                                {/*<RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>*/}
                                {/*</div>*/}
                                {/*))}*/}


                                {/*<RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>*/}
                                {/*</Dialog>*/}
                                <Divider inset={true}/>
                            </div>
                        ))}
                        </div>
                    </List>

                    { ((this.props.activity != undefined) && (this.props.activity != null))
                        ? <List>
                            <div style={{float: 'left'}}>
                                <Subheader style={{float: 'left'}} inset={true}><h3>Activity</h3></Subheader>

                                <br/>
                                <br/>
                                &nbsp;
                                &nbsp;
                            </div>

                            <div style={{margin: 30}}>
                                {this.props.activity.map(lst => (

                                    <div>

                                        <ListItem
                                            leftAvatar={<Avatar icon={<ActionAssignment/>}/>}

                                        >


                                            {(lst.flag == 1)
                                                ? <div><strong>
                                                    {lst.filename}
                                                </strong> created</div>
                                                : <div><strong>
                                                    {lst.filename}
                                                </strong> deleted</div>
                                            }
                                        </ListItem>
                                        <Divider inset={true}/>
                                    </div>
                                ))}
                            </div>
                        </List>
                        : <div> No Activities</div>
                    }
                </div>
            )
        }
    }
}


export default withRouter(StarredFileList);