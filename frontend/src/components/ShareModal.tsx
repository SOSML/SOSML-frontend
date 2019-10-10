import * as React from 'react';

import { Button, Modal , Glyphicon } from 'react-bootstrap';

interface Props {
    error: boolean;
    link: string;
    closeCallback: () => void;
    formContractCallback: () => void;
    enocontract: boolean;
}

class ShareModal extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);

        this.closeShareModal = this.closeShareModal.bind(this);
        this.formContract = this.formContract.bind(this);
    }

    render() {
        if (!this.props.error) {
            return (
                <Modal show={true} onHide={this.closeShareModal}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Share link creation successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group">
                            <input type="text" className="form-control js-copytextarea" value={this.props.link} />
                            <span className="input-group-btn">
                                <button className="btn btn-default" onClick={this.copyShareLink} type="button">
                                    <Glyphicon glyph={'copy'} />
                                </button>
                            </span>
                        </div>
                        <p className="text-justify">
                            Use the above link to share your code.<br/>
                            <b>Attention:</b> The link refers to a read-only version of your code.
                            To share a modified version of your code, please create a new share link.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeShareModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else if (this.props.enocontract) {
            return (
                <Modal show={true} onHide={this.closeShareModal}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Share link creation failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Creating a share link for your code failed.<br/>
                        But I think only other <em>Magical Users</em> have the right to
                        criticize that.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.formContract}>Become a <em>Magical
                        User</em></Button>
                        <Button onClick={this.closeShareModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else {
            return (
                <Modal show={true} onHide={this.closeShareModal}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Share link creation failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Creating a share link for your code failed.<br/>
                        Please try again later.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeShareModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }

    formContract() {
        this.props.formContractCallback();
    }

    closeShareModal() {
        this.props.closeCallback();
    }

    copyShareLink() {
        let copyTextarea = document.querySelector('.js-copytextarea') as HTMLTextAreaElement;
        copyTextarea.select();
        document.execCommand('copy');
    }
}

export default ShareModal;
