export interface NavbarItem {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface NavbarProps {
  logo: string;
  items: NavbarItem[];
}