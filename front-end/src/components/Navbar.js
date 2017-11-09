import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SideNav, { Nav, NavIcon, NavText} from 'react-sidenav';
import {List, ListItem, makeSelectable} from 'material-ui/List';


//specify the base color/background of the parent container if needed

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index,
            });
        };

        render() {
            return (
                <ComposedComponent
                    value={this.state.selectedIndex}
                    onChange={this.handleRequestChange}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);


const Navbar = (props) => (
    <div style={{background: '#F0F8FF', color: '#808080', width: 300}}>

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
        <img width="32" height="32" src="https://cfl.dropboxstatic.com/static/images/logo_catalog/dropbox_logo_glyph_2015_m1-vfleInWIl.svg" alt="" class="dropbox-logo__glyph"/>
        {/*<SideNav highlightColor='#1E90FF' highlightBgColor='#F0F8FF' defaultSelected='home'>*/}
            {/*<div>*/}
            {/*<Nav id='home'>*/}
                {/*<NavText style={{align:'left'}} >Home </NavText>*/}
            {/*</Nav>*/}
            {/*</div>*/}
            {/*<Nav id='files' >*/}
                {/*<NavText style={{align:'left'}} onClick={()=>{console.log("hey sup")}}>Files </NavText>*/}
            {/*</Nav>*/}
            {/*<Nav id='groups'>*/}
                {/*<NavText style={{align:'left'}} >Groups </NavText>*/}
            {/*</Nav>*/}
            {/*<Nav id='shared'>*/}
                {/*<NavText style={{align:'left'}} >Shared </NavText>*/}
            {/*</Nav>*/}
        {/*</SideNav>*/}
        <div>
            <SelectableList defaultValue={1}>
                <ListItem
                    value={1}
                    primaryText="Home"
                    onClick={() => props.handleNavClick("home")}
                />
                <ListItem
                    value={2}
                    primaryText="Files"
                    onClick={() => props.handleNavClick("file")}
                />
                <ListItem
                    value={3}
                    primaryText="Groups"
                    onClick={() => props.handleNavClick("group")}
                    />
                <ListItem
                    value={4}
                    primaryText="Shared"
                    onClick={() => props.handleNavClick("share")}
                />
            </SelectableList>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
        <div>
            &nbsp;
        </div>
    </div>
)

export default Navbar;