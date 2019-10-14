import * as React from 'react';
import { Glyphicon, Grid, Alert } from 'react-bootstrap';

import { SHARING_ENABLED } from '../config';

class Landing extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.handleRedirectToEdit = this.handleRedirectToEdit.bind(this);
    }

    handleRedirectToEdit() {
        this.props.history.replace('/editor', {});
    }

    render() {
        let style: any = {};
        style.marginBottom = '20px';
        style.float = 'right';

        let sharingH: JSX.Element | undefined;
        let sharing: JSX.Element | undefined;

        if (SHARING_ENABLED) {
            sharingH = (
                <h3>Code Sharing</h3>
            );
            sharing = (
                <div>
                    You can share the code that is currently shown in the interpreter by using
                    the &ldquo;Share&rdquo; button. Your code will be uploaded to the servers
                    of Saarland University and you are provided with a link to download your file.
                    Files are always snapshots, neither you nor anyone with the link is able to
                    modify the file. If you want to share an updated version, you have to share the
                    file again (getting a new link for it).

                    <br/><br/>
                    <Alert bsStyle="info"><strong>Warning: </strong>
                    Only upload files and content to which you own the copyright.
                    By uploading a file to the servers of Saarland University, you grant Saarland
                    University and the <a href="https://github.com/SOSML"> SOSML Developers </a>
                    a non-exclusive, worldwide, royalty-free, sub-licensable, and transferable
                    license to use, publish, and create derivative works of your uploaded file.
                    Further, we cannot guarantee the availability of your uploaded files.
                    </Alert>
                </div>
            );
        }

        return (
            <Grid className="flexy">
                <h2>SOSML - Online Interpreter for Standard ML</h2>
                <hr />
                <p>
                    Standard ML is a functional programming language with static type checking
                    and type inference. The language is used to teach a computer science
                    introductory course at Saarland University. This online interpreter
                    is developed by the <a href="https://github.com/SOSML"> SOSML Developers </a>
                    who are (former) students at Saarland University.
                </p>

                <h3>How to use SOSML</h3>
                <div>
                    The editor shows two columns. The left column allows to write Standard ML code
                    and the interpreter output is shown in the right column. Code is evaluated after
                    typing a semicolon (;). The interpreter runs locally in your browser, so no
                    files are being uploaded for evaluation. On successful evaluation your code is
                    highlighted in green. If there is some mistake or an unhandled exception it
                    will become red. (You may also configure the interpreter to use different
                    colors on the <a href="/settings">
                    <Glyphicon glyph="cog" />&nbsp;Settings</a> page.)

                    <br/><br/>

                    <Alert bsStyle="info"><strong>Warning: </strong>
                    Long computations might be terminated by your web browser
                    due to limitations for how long a script is allowed to run.
                    This time limit may be changed on the <a href="/settings">
                        <Glyphicon glyph="cog" />&nbsp;Settings</a> page.
                    </Alert>
                </div>

                <h3>Save your work!</h3>
                <div>
                    If you want to keep SML programs in the interpreter, you have to store them.
                    You can find a text field in which you can enter a file name next to
                    a <p className="buttonSimul"><Glyphicon glyph="file" />&nbsp;Store
                    </p> button.
                    When you change your code, you have to store the file again.
                    You can find all of your files on the <a href="/files">
                    <Glyphicon glyph="file" />&nbsp;Files</a> page.

                    <br/><br/>

                    <Alert bsStyle="info"><strong>Warning: </strong>
                    The files are stored locally inside your browser. If you delete website data of
                    SOSML, all your files are deleted. To save your work outside of your
                    browser, head to the <a href="/files"><Glyphicon glyph="file" />&nbsp;Files</a> page
                    and hit
                    the <p className="buttonSimul"><Glyphicon glyph="download-alt" />&nbsp;Save
                    </p> button.
                    </Alert>
                </div>

                {sharingH}
                {sharing}

                <button className="btn btn-suc-alt" onClick={this.handleRedirectToEdit}
                    style={style} type="button">
                    <Glyphicon glyph="pencil" />&nbsp;Take me to the editor.
                </button>

                <br/>
                <br/>
            </Grid>
        );
    }
}

export default Landing;
