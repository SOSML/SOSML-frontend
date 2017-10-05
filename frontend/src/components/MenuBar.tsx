import * as React from 'react';
import { Nav, Navbar, NavItem, Glyphicon } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
const LinkContainer = require('react-router-bootstrap').LinkContainer;
// ^ this circumvents type checking as the @types/react-router-bootstrap package is buggy
// it does not know the exact property, although it is clearly specified
// in the documentation!

import './MenuBar.css';

interface State {
    forcedDisplay: boolean;
}

class MenuBar extends React.Component<any, State> {
    constructor() {
        super();

        this.state = {
            forcedDisplay: false
        };

        this.handleBrowserMouseMove = this.handleBrowserMouseMove.bind(this);
    }

    render() {
        return (
            <Navbar inverse={true} collapseOnSelect={true} staticTop={true}
                fluid={true} className={(this.state.forcedDisplay) ? 'forcedDisplay' : ''}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <img src="/logo.png" style={{padding: '10px'}} alt="Logo" />
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <NavLink to="/">
                            SOSML
                        </NavLink>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer exact={true} to="/">
                            <NavItem><Glyphicon glyph={'edit'} /> Editor</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav>
                        <LinkContainer to="/files">
                            <NavItem><Glyphicon glyph={'file'} /> Dateien</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav>
                        <LinkContainer to="/help">
                            <NavItem><Glyphicon glyph={'question-sign'} /> Hilfe</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight={true}>
                        <LinkContainer to="/settings">
                            <NavItem><Glyphicon glyph={'cog'} /> Einstellungen</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    // Hover controll
    componentDidMount() {
        window.addEventListener('mousemove', this.handleBrowserMouseMove);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleBrowserMouseMove);
    }

    handleBrowserMouseMove(evt: MouseEvent) {
        if (this.isFullscreen()) {
            if ((evt.pageX < 10 && evt.pageY < 10) && !this.state.forcedDisplay) {
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
