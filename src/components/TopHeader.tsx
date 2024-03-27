"use client";

import { categories } from "@/lib/categories";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Search from "./Search";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React, { useEffect, useRef, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { useClickOutside } from "react-click-outside-hook";

export default function ClientTopHeader() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "general";
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [ref, hasClickedOutside] = useClickOutside();

  const toggleMenu = () => {
    setOpen(!open);
  };

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div
              className={cn(
                `text-[0.65rem] font-medium leading-none`,
                currentCategory === title &&
                  `underline decoration-double underline-offset-8  text-blue-600`
              )}
            >
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  return (
    <div>
      <div className="sticky top-0 h-16  bg-white shadow-sm flex items-center justify-between  !z-50">
        <div className=" flex items-center justify-between  container">
          <div className=" flex items-center">
            <div className="flex items-center gap-x-2">
              <div className=" bg-black px-2 h-7 flex items-center justify-center text-white ">
                N
              </div>
              <h1 className=" font-medium hidden sm:block">NewsHub</h1>
            </div>
            <div className="lg:flex hidden items-center ml-8 uppercase text-xs">
              {categories.map((category, index) => (
                <Link
                  href={`?${new URLSearchParams({ category }).toString()}`}
                  key={category}
                  className={cn(
                    `px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900`,
                    currentCategory === category &&
                      "underline decoration-double underline-offset-8  text-blue-600"
                  )}
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className="lg:hidden sm:block ml-5 hidden ">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px]  grid-cols-2 relative uppercase !text-xs  ">
                        {categories.map((category) => (
                          <ListItem
                            key={category}
                            title={category}
                            href={`?${new URLSearchParams({
                              category,
                            }).toString()}`}
                          ></ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className=" sm:w-[16rem] w-[13rem] flex items-center">
            <Search placeholder="Search" />
            <div className=" sm:hidden block  z-[90]">
              <Hamburger toggled={open} size={20} toggle={toggleMenu} />
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div
          ref={ref}
          className="sticky w-full sm:hidden overflow-hidden block  left-0 shadow-4xl right-0 top-[4rem] p-5 pt-3 bg-white shadow border-b border-b-white/20"
        >
          <ul className="grid gap-2 grid-cols-2 w-full">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  onClick={toggleMenu}
                  href={`?${new URLSearchParams({ category }).toString()}`}
                  className={cn(
                    `px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900`,
                    currentCategory === category &&
                      "underline decoration-double underline-offset-8  text-blue-600"
                  )}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
