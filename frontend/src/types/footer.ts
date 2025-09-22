interface FooterItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FooterSection {
  title: string;
  href?: string;
  items: FooterItem[];
  onClick?: () => void;
}

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export type { FooterItem, FooterSection, FooterProps };