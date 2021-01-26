import * as React from 'react';
import { InterfaceSettings, getInterfaceSettings, WishType } from '../storage';

const Modal = require('react-bootstrap').Modal;

export interface WishNotification {
    wishName: string;
    isNewWish: boolean;
    wishType: WishType;
    error?: any;
}

interface Props {
    closeCallback: (needsReload: boolean) => void;
    notification: WishNotification;
}

export class WishNotificationModal extends React.Component<Props, any> {
    needsReload: boolean;

    constructor(props: Props) {
        super(props);

        this.closeWishNoticicationModal = this.closeWishNoticicationModal.bind(this);
    }

    componentDidMount() {
        if (this.props.notification.isNewWish) {
            // unhide the wish interface
            let ise: InterfaceSettings = getInterfaceSettings();
            this.needsReload = ise.wishingHidden;
            ise.wishingHidden = false;
            localStorage.setItem('interfaceSettings', JSON.stringify(ise));
        }
    }

    render() {
        if (!this.props.notification.error) {
            let style: any = {};
            style.margin = '10px 0 0 0';

            return (
                <Modal show={true} onHide={this.closeWishNoticicationModal}>
                    <Modal.Header closeButton={false}>
                        <Modal.Title>Wish Import Successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-justify" style={style}>
                        {this.props.notification.isNewWish ?
                            'The wish "' + this.props.notification.wishName
                            + '" was imported successfully.'
                        : 'The wish "' + this.props.notification.wishName
                            + '" is already imported.'
                        }
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-def-alt" type="button"
                        onClick={this.closeWishNoticicationModal}>Close</button>
                    </Modal.Footer>
                </Modal>
            );
        } else {
            console.log(this.props.notification.error);
            return (
                <Modal show={true} onHide={this.closeWishNoticicationModal}>
                    <Modal.Header closeButton={false}>
                        <Modal.Title>Wish Import Failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        While trying to import the wish, an error occured.
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-def-alt" type="button"
                        onClick={this.closeWishNoticicationModal}>Close</button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }

    closeWishNoticicationModal() {
        this.props.closeCallback(this.needsReload);
    }
}

export default WishNotificationModal;
