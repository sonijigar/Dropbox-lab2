import React, {Component} from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../src/material_ui_raw_theme_file'

// import HomePage from "./components/HomePage";
// import NewHomePage from "./components/NewHomePage";

import {BrowserRouter} from 'react-router-dom';
import NewerHomePage from "./components/NewerHomePage";


// import HomePage from "./components/HomePage";

    class App extends Component {
        render() {
            return (
                <div>
                    <MuiThemeProvider muiTheme={theme}>
                    <div className="App">
                        {/*<HomePage/>*/}
                        {/*<NewHomePage/>*/}
                        <BrowserRouter>
                            <NewerHomePage/>
                        </BrowserRouter>
                    </div>
                    </MuiThemeProvider>
                </div>
            );
        }
    }

    export default App;
