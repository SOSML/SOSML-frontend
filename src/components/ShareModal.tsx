import * as React from 'react';

import { Button, Modal , Glyphicon } from 'react-bootstrap';

interface Props {
    error: boolean;
    link: string;
    closeCallback: () => void;
}

class ShareModal extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);

        this.closeShareModal = this.closeShareModal.bind(this);
    }

    render() {
        if (!this.props.error) {
            return (
                <Modal show={true} onHide={this.closeShareModal}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Erstellung des Teilen-Links erfolgreich</Modal.Title>
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
                            Nutze den obigen Link, um deinen Code mit deinen Freunden zu teilen.<br/>
                            <b>Hinweis:</b> Unter dem Link befindet sich eine schreibgeschützte Version Deines Codes.
                            Für veränderte Versionen Deines Codes musst Du also einen neuen Teilen-Link erstellen.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeShareModal}>Schließen</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else {
            return (
                <Modal show={true} onHide={this.closeShareModal}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Fehler beim Erstellen des Teilen-Links</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Es konnte leider kein Teilen-Link erstellt werden.<br/>
                        Versuche es später noch einmal.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeShareModal}>Schließen</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
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
