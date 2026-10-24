/** Shapes the Secret Santa API sends to browsers. Shared by the routes and the
 * client components; never includes the pairings. */

export interface SantaPublicView {
  id: string;
  title: string;
  names: string[];
  /** Same order as names: has this person opened theirs? */
  opened: boolean[];
  currency: string;
  budget: string;
  date: string;
  message: string;
}

export interface SantaOpenResult {
  name: string;
  receiver: string;
}

export const ID_RE = /^[a-z0-9]{6,16}$/;
export const TOKEN_RE = /^[a-z0-9]{16,40}$/;
