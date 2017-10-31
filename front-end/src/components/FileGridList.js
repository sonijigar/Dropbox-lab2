import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';

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
        files: PropTypes.array.isRequired
    };

    render(){
        const classes = this.props;

        return (
            <div className={classes.root}>
                <List>
                    <Subheader inset={true}>Files</Subheader>
                    {this.props.files.map(lst => (
                        <ListItem
                            leftAvatar={<Avatar icon={<ActionAssignment />} />}
                            rightIcon={<ActionInfo />}
                            primaryText={lst}
                        />
                    ))}
                </List>
                <Divider inset={true} />
                <List>
                    <Subheader inset={true}>Folders</Subheader>
                </List>
            </div>
        );
    }


}


export default (FileGridList);