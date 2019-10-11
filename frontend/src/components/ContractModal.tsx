import * as React from 'react';

import { Modal } from 'react-bootstrap';

interface Props {
    closeCallback: () => void;
    createCallback: () => void;
}

class ContractModal extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);

        this.closeShareModal = this.closeShareModal.bind(this);
        this.createContract = this.createContract.bind(this);
    }

    render() {
        return (
            <Modal show={true} onHide={this.closeShareModal}>
            <Modal.Header closeButton={false}>
            <Modal.Title>Form an <em>Agreement</em> with me and become a <em>
            Magical User</em></Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    If you want others to have an easy way to access your code,
                    you may form an <em>Agreement</em> with me and become a <em>Magical User</em>.
                    <br/><br/>
                    Once you are a <em>Magical User</em> you may upload you code to the servers
                    of Saarland University.
                    By uploading a file to the servers of Saarland University, you grant Saarland
                    University and the <a href="https://github.com/SOSML"> SOSML Developers </a>
                    a non-exclusive, worldwide, royalty-free, sub-licensable, and transferable
                    license to use, publish, and create derivative works of your uploaded file.
                    <br/>
                    Further, the availability of your uploaded files is not guaranteed.
                </Modal.Body>
            <Modal.Footer>
            <button className="btn btn-suc-alt" onClick={this.createContract} type="button">
            I accept. Turn me into a <em>Magical User</em></button>
            <button className="btn btn-def-alt" onClick={this.closeShareModal} type="button">
            I will decide later.</button>
            </Modal.Footer>
            </Modal>
        );
    }

    createContract() {
        this.props.createCallback();
    }

    closeShareModal() {
        this.props.closeCallback();
    }
}

export default ContractModal;
