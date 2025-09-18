export interface NavbarItem {
  label: string;
  href: string;
  icon?: string; // Optional icon property
}

export interface NavbarProps {
  logo: string;
  items: NavbarItem[];
}