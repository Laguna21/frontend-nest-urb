import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`no-underline text-white hover:bg-gray-700 rounded-md p-3 transition-colors flex items-center bg-red-700`}
    >
      <span className="flex-1 flex items-center justify-start content-center gap-6 pl-4">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
