export interface Route {
  name: string;
  path: string;
  icon: string;
}

export interface CardMenu extends Route {
  description: string;
  color: string;
}
