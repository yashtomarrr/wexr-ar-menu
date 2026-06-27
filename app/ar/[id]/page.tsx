import { ArExperience } from '@/components/ar/ArExperience';
import { menu } from '@/data/menu';

/**
 * AR route: /ar/<dishId> — the destination for every dish QR code and
 * "View in AR" button. Pre-rendered for the sample dishes for speed.
 */
export function generateStaticParams() {
  return menu.map((d) => ({ id: d.id }));
}

export default function ARPage({ params }: { params: { id: string } }) {
  return <ArExperience dishId={params.id} />;
}
