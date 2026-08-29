import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der Schwerathletik Mannheim 2018 e.V.",
  robots: { index: false },
};

export default async function DatenschutzPage() {
  const settings = await getSettings();
  const vorstand = settings.emails.find((m) => m.label === "Vorstand")?.address;

  return (
    <>
      <PageHeader
        eyebrow="Rechtliches"
        title="Datenschutz"
        lead="Diese Website setzt keine Cookies, bindet keine Analyse- oder Tracking-Dienste ein und lädt alle Schriften und Bilder vom eigenen Server. Es gibt deshalb nichts einzuwilligen und kein Cookie-Banner."
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
              Auswertung zu Werbezwecken ebenso wenig.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Keine Cookies, kein Tracking</h2>
            <p className="prose-club mt-4">
              Wir setzen weder Cookies noch vergleichbare Techniken ein und nutzen keine
              Reichweitenmessung. Schriften und Bilder werden ausschließlich von unserem
              eigenen Server geladen — es entsteht beim Besuch dieser Seite keine Verbindung
              zu Servern Dritter.
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
              bei DocuSeal, zu unseren Vereinsdokumenten, zum SKV Sandhofen, zu den Verbänden
              BWG und BVDK sowie zu unseren Profilen bei Instagram und Facebook. Erst wenn du
              einen solchen Link anklickst, werden Daten an den jeweiligen Anbieter
              übertragen. Für deren Verarbeitung gelten die Datenschutzhinweise des jeweiligen
              Anbieters.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Hosting</h2>
            <p className="prose-club mt-4">
              Die Website wird bei einem Dienstleister gehostet, der die Daten in unserem
              Auftrag und weisungsgebunden verarbeitet (Art. 28 DSGVO). Er verarbeitet dabei
              die oben genannten Verbindungsdaten.
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
