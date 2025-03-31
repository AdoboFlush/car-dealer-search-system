import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { visit } from "@/Utils/Functions";
import { isEmpty } from "lodash";
import { CarIcon } from "lucide-react";

export const Header = () => {

    const { auth } = usePage()?.props;

    const navigationItems = [
        {
            title: "Home",
            href: route("home"),
            description: "",
        },
        {
            title: "Browse Cars",
            href:  route("browse-cars"),
            description: "Find your dream car today.",
        },
    ];

    const [isOpen, setOpen] = useState(false);

    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-background">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <CarIcon className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Pinas AutoFinder</span>
                    </div>

                    <div className="border-r hidden md:inline"></div>

                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <>
                                            <NavigationMenuLink>
                                                <Link href={item.href}>
                                                    <Button variant="ghost">{item.title}</Button>
                                                </Link>
                                            </NavigationMenuLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger className="font-medium text-sm">
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base">{item.title}</p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <Button size="sm" className="mt-10">
                                                            Book a call today
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                                            >
                                                                <span>{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                
                <div className="flex lg:justify-center">
                    
                </div>

                <div className="flex justify-end w-full gap-4">
                    
                    {!isEmpty(auth?.user) ? (
                        <>
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={auth.user.profileImageLink} alt={auth.user.name} />
                                <AvatarFallback className="rounded-lg">ADB</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{auth.user.name}</span>
                                <span className="truncate text-xs">{auth.user.email}</span>
                            </div>

                            {auth.user?.type == 'admin' && (
                                <>
                                    <div className="border-r hidden md:inline"></div>
                                    <Button variant="outline" onClick={(e) => visit(e, "dashboard")}>Go to Dashboard</Button>
                                </>
                            )}

                            <Button variant='destructive' onClick={(e) => visit(e, "logout", "post")}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={(e) => visit(e, "login")}>Login</Button>
                            <Button onClick={(e) => visit(e, "register")}>Register</Button>
                        </>
                    )}
                                        
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-lg">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                                            </Link>
                                        ) : (
                                            <p className="text-lg">{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span className="text-muted-foreground">
                                                        {subItem.title}
                                                    </span>
                                                    <MoveRight className="w-4 h-4 stroke-1" />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};