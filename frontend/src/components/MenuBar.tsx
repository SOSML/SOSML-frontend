import * as React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { getInterfaceSettings } from '../storage';
import { getColor } from '../theme';
import './MenuBar.css';
// const LinkContainer = require('react-router-bootstrap').LinkContainer;
const Navbar = require('react-bootstrap').Navbar;

interface State {
    forcedDisplay: boolean;
}

class MenuBar extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            forcedDisplay: false
        };

        this.handleBrowserMouseMove = this.handleBrowserMouseMove.bind(this);
    }

    render() {
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;
        let white = getColor(settings.theme, dt, 'icon_fg');
        let black = getColor(settings.theme, dt, 'icon_bg');

        return (
            <Navbar collapseOnSelect fixed="top"
                className={(this.state.forcedDisplay) ? 'forcedDisplay' : ''}>
                <div className="navbar-header">
                   <Navbar.Brand style={{padding: "10px"}}>
                        <svg viewBox="0 0 52 52" width="28px">
                            <circle cx={26} cy={26} r={24} stroke={black} strokeWidth={1}
                                fill={white} />
                            <circle cx={26} cy={26} r={10} stroke={black} strokeWidth={1}
                                fill={black} />
                            <circle cx={17} cy={15} r={7} stroke={black} strokeWidth={1}
                                fill="#fff" />
                        </svg>
                    </Navbar.Brand>
                    <Navbar.Brand  style={{'paddingLeft': "0px", 'marginLeft': "-5px"}}>
                        <Nav.Link eventKey="0" as="div">
                        <NavLink to="/" className="nav-brand">
                            SOSML
                        </NavLink>
                        </Nav.Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                        <span className="glyphicon glyphicon-menu-hamburger" /> Menu
                    </Navbar.Toggle>
                </div>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link eventKey="1" as="div">
                            <NavLink to="/editor" className="nav-link2">
                            <span className="glyphicon glyphicon-pencil" /> Editor
                            </NavLink>
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link eventKey="2" as="div">
                        <NavLink to="/files" className="nav-link2">
                            <span className="glyphicon glyphicon-duplicate" /> Files
                        </NavLink>
                        </Nav.Link>
                    </Nav>
                    <div className="navbar-right">
                        <Nav.Link eventKey="3" as="div">
                        <NavLink to="/settings" className="nav-link2">
                            <span className="glyphicon glyphicon-cog" /> Settings
                        </NavLink>
                        </Nav.Link>
                    </div>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    // Hover control
    componentDidMount() {
        window.addEventListener('mousemove', this.handleBrowserMouseMove, {passive: true});
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleBrowserMouseMove);
    }

    handleBrowserMouseMove(evt: MouseEvent) {
        if (this.isFullscreen()) {
            if (evt.pageY < 10 && !this.state.forcedDisplay) {
                this.setState({
                    forcedDisplay: true
                });
            } else if (this.state.forcedDisplay) {
                let node: Node = evt.target as Node;
                let foundNavbar = false;
                while (true) {
                    if (node.nodeName.toLowerCase() === 'nav') {
                        foundNavbar = true;
                        break;
                    }
                    if (!node.parentNode) {
                        break;
                    }
                    node = node.parentNode;
                }

                if (!foundNavbar) {
                    this.setState({
                        forcedDisplay: false
                    });
                }
            }
        } else if (this.state.forcedDisplay) {
            this.setState({
                forcedDisplay: false
            });
        }
    }

    private isFullscreen() {
        let body = document.getElementsByTagName('body')[0];
        return body.classList.contains('fullscreen');
    }
}

export default MenuBar;
