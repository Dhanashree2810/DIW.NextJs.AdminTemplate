'use client'
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
    Home,
    Menu,
} from "lucide-react";
import img1 from "@/assets/images/only-logo.png";
import img2 from "@/assets/images/only-text.png";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { IoPerson } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";


export default function NavbarPage() {
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
        <>
            {/* <div className="flex h-10 items-center gap-4 border-b bg-muted/40 px-4  lg:h-[10px] lg:px-6"> */}
            <div className="flex items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col overflow-y-auto ">
                        <nav className="grid gap-2 text-lg font-medium">
                            <header className="flex items-center px-4 border-b bg-white h-24 lg:h-[80px] lg:px-6">
                                <Link href="/" className="flex items-center gap-2 font-semibold">
                                    <Image src={img1} alt="Logo" className="h-11 w-10" />
                                    <Image src={img2} alt="Text" className="h-11 w-12 overflow-hidden" />
                                </Link>
                            </header>

                            {menuItems.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                    <h1 className="mt-4">{section.title}</h1>
                                    {section.links.map((link, linkIndex) => {
                                        const isActive = pathname.startsWith(link.href);
                                        return (
                                            <Link
                                                key={linkIndex}
                                                href={link.href}
                                                className={`flex items-center gap-2 py-1 px-1 mt-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-green-700 hover:text-white ${isActive ? 'bg-green-700 text-white' : 'text-gray-500'
                                                    } group`}
                                            >
                                                <div
                                                    className={`flex h-7 w-7 items-center justify-center rounded-full ${isActive ? 'bg-white text-green-700' : 'bg-gray-100 text-gray-600'
                                                        } group-hover:text-green-600`}
                                                >
                                                    {link.icon}
                                                </div>
                                                <span className="font-normal group-hover:text-white">{link.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>

                        <footer className="flex items-center pt-2 bg-white">
                            <Link href="/" className="flex items-center text-lg gap-3 text-red-500 font-normal px-1">
                                <BiLogOutCircle className="h-7 w-7" />
                                Logout
                            </Link>
                        </footer>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}