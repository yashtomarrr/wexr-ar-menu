import type { Dish } from '@/types';

/**
 * ════════════════════════════════════════════════════════════════
 *  SAMPLE MENU  —  the restaurant edits ONLY this array.
 *  For each dish you typically change: image, model, price, description.
 *  Nothing in the app code needs to change.
 *
 *  3D MODELS
 *  ---------
 *  Out of the box every dish points at a real, AR-capable sample model
 *  (loads + does AR on both Android and iPhone) so the demo runs instantly.
 *  Replace `model` (.glb) and `modelIos` (.usdz) with each dish's real scan:
 *      put files in /public/models/ and use e.g. "/models/butter-chicken.glb".
 *  Tools: Polycam / KIRI Engine (phone scan → GLB + USDZ).
 *
 *  realScale = true plated size in METRES → makes AR life-size.
 *  IMAGES are tasteful local SVGs in /public/dishes/ — swap for real photos.
 * ════════════════════════════════════════════════════════════════
 */

// Reliable, CORS-enabled, AR-capable sample model (Android + iOS). Demo default.
const SAMPLE_GLB = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
const SAMPLE_USDZ = 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz';

export const menu: Dish[] = [
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    description:
      'Char-grilled cottage cheese with bell peppers and onion, smoked in the tandoor and finished with mint chutney.',
    price: 349,
    category: 'Starter',
    image: '/dishes/paneer-tikka.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    realScale: { x: 0.22, y: 0.06, z: 0.22 },
    rotation: 0,
    veg: true,
    spice: 'Medium',
    bestSeller: true,
    available: true,
    sizeLabel: '22 cm platter · 6 pieces',
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    description:
      'Tandoori chicken simmered in a velvety tomato-and-butter gravy, finished with cream and fenugreek.',
    price: 449,
    category: 'Main Course',
    image: '/dishes/butter-chicken.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    realScale: { x: 0.18, y: 0.07, z: 0.18 },
    rotation: 0,
    veg: false,
    spice: 'Mild',
    bestSeller: true,
    available: true,
    sizeLabel: '18 cm bowl · serves 2',
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description:
      'Wood-fired thin crust with San Marzano tomato, fresh mozzarella, basil and extra-virgin olive oil.',
    price: 399,
    category: 'Main Course',
    image: '/dishes/margherita-pizza.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    // 12 inch pizza = 0.3048 m diameter
    realScale: { x: 0.305, y: 0.03, z: 0.305 },
    rotation: 0,
    veg: true,
    spice: 'None',
    available: true,
    sizeLabel: '12" diameter',
  },
  {
    id: 'gourmet-burger',
    name: 'Truffle Gourmet Burger',
    description:
      'Aged beef patty, truffle aioli, smoked cheddar and caramelised onion in a toasted brioche bun.',
    price: 479,
    category: 'Main Course',
    image: '/dishes/gourmet-burger.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    realScale: { x: 0.1, y: 0.11, z: 0.1 },
    rotation: 0,
    veg: false,
    spice: 'Mild',
    bestSeller: true,
    available: true,
    sizeLabel: '11 cm tall',
  },
  {
    id: 'veg-biryani',
    name: 'Hyderabadi Veg Biryani',
    description:
      'Long-grain basmati dum-cooked with seasonal vegetables, saffron and fried onions. Served with raita.',
    price: 329,
    category: 'Bread & Rice',
    image: '/dishes/veg-biryani.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    realScale: { x: 0.2, y: 0.09, z: 0.2 },
    rotation: 0,
    veg: true,
    spice: 'Hot',
    available: true,
    sizeLabel: '20 cm handi',
  },
  {
    id: 'chocolate-lava',
    name: 'Chocolate Lava Cake',
    description:
      'Warm molten dark-chocolate cake with a flowing centre, served with vanilla bean ice cream.',
    price: 249,
    category: 'Dessert',
    image: '/dishes/chocolate-lava.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    realScale: { x: 0.12, y: 0.06, z: 0.12 },
    rotation: 0,
    veg: true,
    spice: 'None',
    available: true,
    sizeLabel: '12 cm · with scoop',
  },
  {
    id: 'belgian-cold-coffee',
    name: 'Belgian Cold Coffee',
    description:
      'Double-shot cold brew blended with Belgian chocolate and milk, topped with whipped cream.',
    price: 199,
    category: 'Beverage',
    image: '/dishes/belgian-cold-coffee.svg',
    model: SAMPLE_GLB,
    modelIos: SAMPLE_USDZ,
    realScale: { x: 0.08, y: 0.16, z: 0.08 },
    rotation: 0,
    veg: true,
    spice: 'None',
    available: true,
    sizeLabel: '9 cm cup · 350 ml',
  },
];

/** Ordered category list derived from the menu (keeps tabs in menu order). */
export const categories = Array.from(new Set(menu.map((d) => d.category)));
