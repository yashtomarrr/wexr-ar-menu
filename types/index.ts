/**
 * Central type definitions for the whole app.
 * Keeping every shared shape here makes the data contract obvious and is the
 * single place to evolve as the product grows.
 */

export type Category =
  | 'Starter'
  | 'Main Course'
  | 'Bread & Rice'
  | 'Dessert'
  | 'Beverage';

export type SpiceLevel = 'None' | 'Mild' | 'Medium' | 'Hot';

/** Real-world size of the plated dish, in metres, used to scale the AR model. */
export interface RealScale {
  x: number;
  y: number;
  z: number;
}

/** A single menu item. This is the ONLY shape a restaurant needs to edit. */
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  /** Photo for the menu card (any URL or /public path). */
  image: string;
  /** GLB model for Android Scene Viewer + in-page 3D preview. */
  model: string;
  /** USDZ model for iOS AR Quick Look (optional but recommended). */
  modelIos?: string;
  /** True plated size in metres so AR shows it life-size. */
  realScale: RealScale;
  /** Default Y rotation (degrees) applied to the in-page preview. */
  rotation: number;
  veg: boolean;
  spice: SpiceLevel;
  bestSeller?: boolean;
  available?: boolean;
  /** Optional human-readable size note shown on the AR screen, e.g. '12" diameter'. */
  sizeLabel?: string;
}

/** A line in the cart / an order. */
export interface CartLine {
  dishId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Kitchen flow: New -> Preparing -> Served -> Completed (delivered & done).
// 'Cancelled' is a terminal side-exit.
export type OrderStatus =
  | 'New'
  | 'Preparing'
  | 'Served'
  | 'Completed'
  | 'Cancelled';

export interface CustomerInfo {
  name: string;
  phone: string;
  table: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: number;
  status: OrderStatus;
  items: CartLine[];
  customer: CustomerInfo;
  total: number;
}

/** Branding/config contract — everything needed to re-skin per restaurant. */
export interface RestaurantConfig {
  name: string;
  tagline: string;
  logo: string;
  heroHeadline: string;
  heroSub: string;
  currency: string;
  currencySymbol: string;
  /** RGB channel strings ("212 175 55") injected as CSS variables. */
  theme: {
    bg: string;
    surface: string;
    elevated: string;
    gold: string;
    goldSoft: string;
    ink: string;
    muted: string;
    veg: string;
    nonveg: string;
  };
  poweredBy: string;
}

/** The backend contract — both the local and Supabase drivers implement this. */
export interface BackendService {
  createOrder(order: Order): Promise<Order>;
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
  /** Subscribe to live order changes. Returns an unsubscribe fn. */
  subscribe(onChange: (orders: Order[]) => void): () => void;
}
