import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">Fehler 404</p>
      <h1 className="brand-rule mt-4 text-[clamp(2.5rem,8vw,5rem)] leading-none">
        Seite nicht
        <span className="block text-accent">gefunden</span>
      </h1>
      <p className="prose-club mt-7 max-w-md">
        Diese Adresse gibt es nicht mehr. Möglicherweise stammt der Link noch von unserer alten
        Seite — die wichtigsten Inhalte findest du über die Navigation.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button href="/">Zur Startseite</Button>
        <Button href="/news" variant="outline">
          Zu den News
        </Button>
      </div>
    </div>
  );
}
