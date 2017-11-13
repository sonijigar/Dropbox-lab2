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
import ReactTooltip from 'react-tooltip'
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

class GroupList extends Component {
    static propTypes = {
        //classes: PropTypes.object.isRequired,
        groups: PropTypes.array.isRequired,
        //dirs: PropTypes.array.isRequired,
        //handleDirClick: PropTypes.func.isRequired
    };

    handleShowMembers = (lst) => {
        this.setState({
            open1:true,
            groupname:lst,
        })
        //API.showT
    }

    handleOpen = (lst) => {
        this.setState({
            open:true,
            groupname:lst,
        })
    }

    handleClose = (lst) => {
        this.setState({
            open:false,
            groupname:'',
        })
    }

    mouseOver = (name) => {
        API.groupMembers(name)
            .then(data => {
                this.setState({
                groupmembers:data.users
                });
                console.log(data)
            }
            )

    }
    handleShareholderNameChange = (idx) => (evt) => {
        const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
            if (idx !== sidx) return shareholder;
            return { ...shareholder, email: evt.target.value };
        });

        this.setState({ shareholders: newShareholders });
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
            groups:[],
            open:false,
            groupname:'',
            members:[],
            // dirs:[],
            shareholders: [{email: '' }],
            groupmembers:'',
        };
    }

    render(){
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Add"
                primary={true}
                onClick={this.handleClose}
            />,
        ];

        const actions1 = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.handleClose}
            />,
        ];
        const classes = this.props;
        if (this.props.groups == undefined || this.props.groups.length == 0) {
            return (
                <div>{console.log(this.props.groups)}
                    <h2>No Groups Exist<br/><br/>
                </h2>
                </div>
            )
        }
        else {
            return (
                <div className={classes.root}>
                    <List>
                        <div>
                            <Subheader inset={true}>Groups</Subheader>
                            <br/>
                        </div>
                        {this.props.groups.map(lst => (

                            <div>
                                <div style={{float:'left', width:'90%'}}>

                                    <a data-tip={this.state.groupmembers}>

                                    <ListItem
                                    //leftAvatar={<Avatar icon={<FileFolder/>}/>}
                                    leftAvatar={<i className="material-icons" >account_circle</i>}

                                    primaryText={lst.name}

                                    onClick={()=>{

                                        var ob = {name:lst.name}
                                        console.log("naammee::",ob)
                                        this.mouseOver(ob)}}

                                    // onClick={() => {
                                    //     var obj = {dirname: lst}
                                    //     console.log("it is clicked")
                                    //     this.props.handleDirClick(obj)
                                    // }}
                                    /></a>
                                </div>

                                <ReactTooltip place="right" type="dark" effect="float"/>
                                <IconMenu style={{float:'right' }}
                                    iconButtonElement={<IconButton><MoreVertIcon
                                        tooltipPosition="bottom-center"/><IconButton touch={true}
                                                                                     tooltipPosition="bottom-center">

                                    </IconButton></IconButton>}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}

                                >
                                    <MenuItem primaryText="Show Member" onClick={() => {this.handleShowMembers(lst)}}/>
                                    <MenuItem primaryText="Add Members" onClick={() => {this.handleOpen(lst)}}/>
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
                                </IconMenu>

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

                                <Dialog
                                    title="Enter email"
                                    actions={actions1}
                                    modal={true}
                                    open={this.state.open1}
                                >
                                    <List>
                                    {this.state.members.map((shareholder, idx) => (
                                        <div className="shareholder">
                                            <ListItem
                                                //type="text"
                                                //placeholder={`person #${idx + 1}`}
                                                primaryText={shareholder.email}
                                                //onChange={this.handleShareholderNameChange(idx)}
                                            />
                                            &nbsp;
                                            &nbsp;
                                            <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                                        </div>
                                    ))}
                                    </List>


                                    <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                                </Dialog>
                                <Divider inset={true}/>
                            </div>
                        ))}
                    </List>
                </div>
            )
        }
    }
}


export default withRouter(GroupList);