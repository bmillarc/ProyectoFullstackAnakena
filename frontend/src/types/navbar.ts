export interface NavbarItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo: string;
  items: NavbarItem[];
}