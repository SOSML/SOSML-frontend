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
                    You can share the code that is currently shown in SOSML by using
                    the <p className="buttonSimul"><Glyphicon glyph="link" />&nbsp;Share
                    </p> button. Your code will be uploaded to the servers
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
                <h2>SOSML - the Online Interpreter for Standard ML</h2>
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
                    whereas the right column shows the output of SOSML. Code is evaluated after
                    typing a semicolon (;). SOSML runs locally in your web browser, so no
                    files are being uploaded for evaluation. On successful evaluation, your code
                    and the corresponding output will be become green or blue.
                    If there is some mistake or an unhandled exception, your code and the output
                    will become red instead. (You may configure SOSML to use different
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
                    If you want to keep SML programs in SOSML, you have to store them
                    using the <p className="buttonSimul"><Glyphicon glyph="file" />&nbsp;Store
                    </p> button above your code.
                    When you change your code, you have to store the file again.
                    To view or change your stored files, just
                    head to the <a href="/files"><Glyphicon glyph="duplicate"/>&nbsp;Files</a> page.

                    <br/><br/>

                    <Alert bsStyle="info"><strong>Warning: </strong>
                    The files are stored locally inside your web browser. If you delete the
                    website data of SOSML, all your files will be deleted.
                    To export yor work from your web browser, head to
                    the <a href="/files"><Glyphicon glyph="duplicate" />&nbsp;Files</a> page and hit
                    the <p className="buttonSimul"><Glyphicon glyph="download-alt" />&nbsp;Save
                    </p> button next to the file you want to save.
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
