/** Shared cart line shape — kept in `lib` to avoid circular imports with `CartDrawer`. */
export interface CartItem {
  id:       string;
  name:     string;
  price:    string;
  material: string;
  qty:      number;
  /** When set, merges qty only with the same product id + size. */
  size?:    string;
}
