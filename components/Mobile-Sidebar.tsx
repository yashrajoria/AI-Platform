"use client";
import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
    apiLimitCount: number,
    isPro: boolean
}

const MobileSidebar = ({
    apiLimitCount = 0,
    isPro = false
}: MobileSidebarProps) => {
    //added to resolve hydration error

    //Hydration error fix start
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
