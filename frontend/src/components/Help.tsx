import * as React from 'react';
import { Alert } from 'react-bootstrap';

class Help extends React.Component<any, any> {
    render() {
        return (
            <div className="container flexy">
                <h2>Hilfe</h2>
                <hr />
                <h3>Grundlegende Benutzung des Interpreters</h3>
                <p>
                    In der Editor-Ansicht kannst Du links Code in den Interpreter eintippen.<br/>
                    Standardmäßig wird Dein Code ausgeführt, sobald Du eine Anweisung mit einem
                    Semikolon (<code>;</code>) abschließt; dabei wird ein Interpreter benutzt, der bei Dir im Browser läuft.<br/>
                    Alternativ kannst Du Deinen Code auch auf unserem Server ausführen lassen; benutze dazu den
                    „Umschalten“-Button am oberen Rand des „Ausgabe“-Fensters. Hier ist auch vermerkt, wo genau Dein Code
                    ausgeführt wird.
                </p>
                <Alert bsStyle="info">
                    <strong>Aufgepasst! </strong>Zum Ausführen auf dem Server musst Du extra
                    den „Ausführen“-Button betätigen.
                </Alert>
                <h4>Code im Browser ausführen lassen</h4>
                <p>
                    Im Browser-Modus wird Dein SML-Code automatisch ausgeführt,
                    sobald Du Anweisung mit einem Semikolon (<code>;</code>) abschließt.
                    Bei erfolgreicher Ausführung wird Dein Code dann <i>grün</i> hinterlegt;
                    ist Dein Code ungültig oder beinhaltet nicht behandelte SML Ausnahme, so wird Dein Code <i>rot</i> hinterlegt.
                    In allen Fällen erscheint die Ausgabe Deines Programms (oder die Fehlermeldung)
                    im rechten „Ausgabe“-Fenster.
                </p>
                <Alert bsStyle="info">
                    <strong>Aufgepasst! </strong>Bei Code, dessen Berechnung sehr viel Zeit beansprucht, wird diese
                    nach einegen Sekunden abgebrochen. Auch dann erscheint eine Fehlermeldung im „Ausgabe“-Fenster.
                </Alert>
                <h4>Code auf dem Server ausführen lassen</h4>
                <p>
                    Im Server Modus wird Dein SML-Code erst ausgeführt, wenn Du den „Ausführen“-Button benutzt.
                    Dann wird Dein Code an den Server geschickt und dort mit dem Interpreter „MoscowML“ ausgeführt.
                    Nach wenigen Sekunden, bekommst Du dann die Ausgabe des Interpreters im „Ausgabe“-Fenster angezeigt.
                </p>
                <Alert bsStyle="info">
                    <strong>Aufgepasst! </strong>Bei Code, dessen Berechnung sehr viel Zeit beansprucht, wird diese
                    nach einegen Sekunden abgebrochen. Dann erscheint eine Fehlermeldung im „Ausgabe“-Fenster.
                </Alert>
                <Alert bsStyle="info">
                    <strong>Aufgepasst! </strong>In diesem Modus wird Dein Code nicht farbig hinterlegt.
                </Alert>
                <hr />
                <h3>Code teilen</h3>
                <p>
                    Du kannst Deinen Code mit Mitstudenten teilen, indem Du in der „Editor“-Ansicht den „Teilen“-Button betätigst.
                    Dann wird Dein Code auf unserem Server (anonymisiert) gespeichert und ein Link zu deinem Code erstellt.
                    Dieser Link speichert eine schreibgeschützte Version des Codes, wie er sicht zur Zeit des Teilens in dem Editor befand.
                    Um also Änderungen weiterzureichen, musst Du Deinen geänderten Code erneut teilen.
                </p>
                <hr />
                <h3>Code speichern und die Dateiansicht</h3>
                <p>
                    In neueren Browsern wird Dein Code automatisch gespeichert und erscheint im Editor, sobald Du ihn öffnest.
                    Solltest Du jedoch mehr als eine Code-Datei speichern wollen, so kannst Du dies, indem Du einen Dateinamen für dienen Code
                    festlegst und den „Speichern”-Button benutzt. Auf diese Weise gespeicherten Code findest Du unter der Dateiansicht,
                    zu welcher du über den Link in der Kopfzeile gelangst.<br/>
                    Um Code aus der Dateiansicht in den Editor zu laden, clicke auf den Dateinamen des entsprechenden Codes.<br/>
                    In der Dateiansicht findest Du auch Codebeispiele aus Deinem „Programmierung 1“-Lehrbuch.
                </p>
                <Alert bsStyle="info">
                    <strong>Aufgepasst! </strong>Alle gespeicherten Dateien befinden sich im lokalen Speicher Deines Browsers.
                    Solltest Du diesen löschen, so verschwinden auch deine gespeicherten Dateien.
                </Alert>
            </div>
        );
    }
}

export default Help;
