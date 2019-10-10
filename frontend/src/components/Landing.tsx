import * as React from 'react';
import { Alert, Button } from 'react-bootstrap';

class Landing extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.handleRedirectToEdit = this.handleRedirectToEdit.bind(this);
    }

    handleRedirectToEdit() {
        this.props.history.replace('/editor', {});
    }

    render() {
        return (
           <div className="container flexy">
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
                <p>
                    The editor shows two columns. The left column allows to write Standard ML code
                    and the interpreter output is shown in the right column. Code is evaluated after
                    typing a semicolon (;). The interpreter runs locally in your browser, so no
                    files are being uploaded for evaluation. On successful evaluation your code is
                    highlighted in green. If there is some mistake or an unhandled exception it
                    will become red. (You may also configure the interpreter to use different
                    colors on the <a href="/settings">settings page</a>.)

                    <br/><br/>

                    <Alert bsStyle="info"><strong>Warning: </strong>
                    Long computations might be terminated by your web browser
                    due to limitations for how long a script is allowed to run.
                    This time limit may be changed on the <a href="/settings">settings page</a>.
                    </Alert>
                </p>

                <h3>Save your work!</h3>
                <p>
                    If you want to keep SML programs in the interpreter you have to save them.
                    You can find a text field in which you can enter a file name next to
                    a &ldquo;Save&rdquo; button. When you change your code, you have to save the
                    file again. You can find all of your files on the <a href="/files">files
                    page</a>.

                    <br/><br/>

                    <Alert bsStyle="info"><strong>Warning: </strong>
                    The files are saved locally inside your browser. If you delete website data of
                    sosml.org, all your files are deleted.
                    </Alert>
                </p>

                <h3>Code Sharing</h3>
                <p>
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
                </p>

                <Button bsStyle="success" onClick={this.handleRedirectToEdit}>
                    Take me to the editor.
                </Button>
            </div>
        );
    }
}

export default Landing;
