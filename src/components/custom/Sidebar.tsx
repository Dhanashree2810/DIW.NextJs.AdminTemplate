'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import {Home} from "lucide-react";
import img1 from "@/assets/images/only-logo.png";
import img2 from "@/assets/images/only-text.png";
import { IoPerson } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";


export function SidebarPage() {
  const pathname = usePathname();
  const menuItems = [
    {
      title: "admin",
      links: [
        { href: "/admin", icon: <Home className="h-4 w-4" />, label: "Home" },
      ],
    },
    {
      title: "Users",
      links: [
        { href: "/admin/appuser", icon: <IoPerson className="h-4 w-4" />, label: "User" },
      ],
    },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex flex-col h-full max-h-screen">
        <header className="flex items-center px-4 border-b bg-white h-28 lg:h-[90px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src={img1} alt="Logo" className="h-15 w-12" />
            <Image src={img2} alt="Text" className="h-15 w-12 overflow-hidden" />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto font-sans">
          <nav className="px-2 text-sm font-medium lg:px-4">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h1 className="mt-4">{section.title}</h1>
                {section.links.map((link, linkIndex) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className={`flex items-center gap-2 py-1 px-1 mt-2 rounded-md transition-colors duration-200 hover:bg-green-700 hover:text-white ${isActive ? 'bg-green-700 text-white' : 'text-gray-500'} group`}
                    >
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isActive ? 'bg-white text-green-700' : 'bg-gray-100 text-gray-600'} group-hover:text-green-600`}>
                        {link.icon}
                      </div>
                      <span className="font-normal group-hover:text-white">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </main>

        <footer className="flex items-center  p-3 border-t bg-white">
          <Link href="/" className="flex items-center gap-3 text-red-500">
            <BiLogOutCircle className="h-4 w-4 " />
            Logout
          </Link>
        </footer>
      </div>
    </div>
  );
}
