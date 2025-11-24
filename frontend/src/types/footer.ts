interface FooterItem {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  href?: string;
  items: FooterItem[];
}

export type { FooterItem, FooterSection };