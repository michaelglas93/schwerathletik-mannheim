import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der Schwerathletik Mannheim 2018 e.V.",
};

export default async function DatenschutzPage() {
  const settings = await getSettings();
  const vorstand = settings.emails.find((m) => m.label === "Vorstand")?.address;

  return (
    <>
      <PageHeader
        eyebrow="Rechtliches"
        title="Datenschutz"
        lead="Die öffentlichen Seiten setzen keine Cookies, binden keine Analyse- oder Tracking-Dienste ein und laden alle Schriften und Bilder vom eigenen Server. Es gibt deshalb nichts einzuwilligen und kein Cookie-Banner."
      />

      <Section>
        <div className="max-w-2xl space-y-10">
          <div>
            <h2 className="text-xl">Verantwortlicher</h2>
            <address className="prose-club mt-4 not-italic">
              {settings.clubName}
              <br />
              {settings.address.co}
              <br />
              {settings.address.street}
              <br />
              {settings.address.zip} {settings.address.city}
              <br />
              <a href={`mailto:${vorstand}`}>{vorstand}</a>
            </address>
          </div>

          <div>
            <h2 className="text-xl">Server-Logdateien</h2>
            <p className="prose-club mt-4">
              Beim Aufruf dieser Website verarbeitet unser Hosting-Anbieter automatisch
              Verbindungsdaten: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse,
              übertragene Datenmenge, verweisende Seite sowie Browser und Betriebssystem.
              Diese Daten sind technisch notwendig, um die Seite auszuliefern und ihren
              sicheren Betrieb zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
              DSGVO. Eine Zusammenführung mit anderen Daten findet nicht statt, eine
              Auswertung zu Werbezwecken ebenso wenig. Wir speichern diese Daten nur so
              lange, wie es für den sicheren Betrieb der Website erforderlich ist; danach
              werden sie gelöscht.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Keine Cookies, kein Tracking</h2>
            <p className="prose-club mt-4">
              Auf den öffentlichen Seiten setzen wir weder Cookies noch vergleichbare
              Techniken ein und nutzen keine Reichweitenmessung. Schriften und Bilder werden
              ausschließlich von unserem eigenen Server geladen — es entsteht beim Besuch
              dieser Seiten keine Verbindung zu Servern Dritter. Eine Ausnahme ist das
              Redaktions-Backend, das nur unsere Redaktion benutzt; dazu unten mehr.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Fotos und Namen von Mitgliedern</h2>
            <p className="prose-club mt-4">
              Auf dieser Website zeigen wir Fotos von Mitgliedern und nennen im Team-Bereich
              sowie in den Wettkampfberichten Namen und Ergebnisse. Rechtsgrundlage ist die
              Einwilligung der Betroffenen nach Art. 6 Abs. 1 lit. a DSGVO, bei
              Minderjährigen die der Sorgeberechtigten. Wettkampfergebnisse von Jugendlichen
              veröffentlichen wir nur mit Vornamen.
            </p>
            <p className="prose-club mt-4">
              Die Einwilligung ist freiwillig und lässt sich jederzeit für die Zukunft
              widerrufen — eine formlose E-Mail an{" "}
              <a href={`mailto:${vorstand}`}>{vorstand}</a> genügt. Wir nehmen das
              betreffende Bild dann von der Website und löschen die Datei vom Server. Die
              Rechtmäßigkeit der Veröffentlichung bis zum Widerruf bleibt davon unberührt.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Redaktions-Backend</h2>
            <p className="prose-club mt-4">
              Unter <code>/studio</code> liegt das Redaktionswerkzeug, mit dem wir die
              Inhalte dieser Website pflegen. Es ist ausschließlich für unsere Redaktion
              gedacht. Wer es dort aufruft und sich anmeldet, baut eine Verbindung zum
              Redaktionssystem Sanity auf; dabei werden Anmeldedaten im Browser gespeichert.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mit dem Anbieter besteht für
              diesen Fall ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
            </p>
            <p className="prose-club mt-4">
              Für alle anderen Seiten gilt das nicht: Texte holt unser Server ab, bevor er
              die Seite ausliefert, und Bilder gehen ebenfalls über unseren Server. Beim
              normalen Besuch der Website entsteht deshalb keine Verbindung zu Sanity.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Kontaktaufnahme</h2>
            <p className="prose-club mt-4">
              Schreibst du uns eine E-Mail, verarbeiten wir die von dir mitgeteilten Daten, um
              deine Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f
              DSGVO. Wir löschen die Nachrichten, sobald sie nicht mehr benötigt werden und
              keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Externe Links</h2>
            <p className="prose-club mt-4">
              An einzelnen Stellen verlinken wir bewusst nach außen — etwa zum Aufnahmeantrag
              bei DocuSeal, zu unseren Vereinsdokumenten bei Google Drive, zum SKV Sandhofen,
              zu den Verbänden BWG und BVDK sowie zu unseren Profilen bei Instagram und
              Facebook. Erst wenn du einen solchen Link anklickst, werden Daten an den
              jeweiligen Anbieter übertragen — bei Google, Meta und DocuSeal möglicherweise
              auch in die USA. Für deren Verarbeitung gelten die Datenschutzhinweise des
              jeweiligen Anbieters.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Hosting</h2>
            <p className="prose-club mt-4">
              Die Website läuft bei der Vercel Inc., 440 N Barranca Avenue #4133, Covina,
              CA 91723, USA. Vercel verarbeitet die genannten Verbindungsdaten in unserem
              Auftrag und weisungsgebunden; es besteht ein Auftragsverarbeitungsvertrag nach
              Art. 28 DSGVO. Dabei können Daten in die USA übertragen werden. Vercel ist unter dem
              EU-US Data Privacy Framework zertifiziert, das die Europäische Kommission mit
              Beschluss vom 10. Juli 2023 als angemessenes Schutzniveau anerkannt hat
              (Art. 45 DSGVO).
            </p>
          </div>

          <div>
            <h2 className="text-xl">Deine Rechte</h2>
            <p className="prose-club mt-4">
              Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
              Verarbeitung, auf Datenübertragbarkeit sowie ein Widerspruchsrecht gegen
              Verarbeitungen auf Grundlage berechtigter Interessen. Wende dich dafür an die
              oben genannte Adresse. Außerdem steht dir ein Beschwerderecht bei einer
              Datenschutz-Aufsichtsbehörde zu; zuständig ist der Landesbeauftragte für den
              Datenschutz und die Informationsfreiheit Baden-Württemberg.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
