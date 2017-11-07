import React from 'react';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';


//specify the base color/background of the parent container if needed
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
        <SideNav highlightColor='#1E90FF' highlightBgColor='#F0F8FF' defaultSelected='home'>
            <Nav id='home'>
                <NavText style={{align:'left'}} >Home </NavText>
            </Nav>
            <Nav id='files'>
                <NavText style={{align:'left'}} >Files </NavText>
            </Nav>
            <Nav id='groups'>
                <NavText style={{align:'left'}} >Groups </NavText>
            </Nav>
            <Nav id='shared'>
                <NavText style={{align:'left'}} >Shared </NavText>
            </Nav>

        </SideNav>
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
        <div>
            &nbsp;
        </div>
    </div>
)

export default Navbar;