import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import * as API from '../api/API';


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

    //var arrr = this.props.files

    constructor() {
        super();
        this.state = {
            files:[],
            dirs:[]
        };
    }

    componentWillMount(){
        console.log("fileprops:", this.props.files)
    }


    render() {
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
                        <Subheader inset={true}>Folders</Subheader>
                        {this.props.dirs.map(lst => (
                            <div>
                                <ListItem
                                    leftAvatar={<Avatar icon={<FileFolder/>}/>}
                                    rightIconButton={<IconMenu
                                        iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}

                                    >
                                        <MenuItem primaryText="Download"/>
                                        <MenuItem primaryText="Share"/>
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
                                        iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
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
                                        <MenuItem primaryText="Share"/>
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