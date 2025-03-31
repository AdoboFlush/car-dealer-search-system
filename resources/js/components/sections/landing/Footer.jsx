import { Link } from "@inertiajs/react";

export const Footer = () => {
    const navigationItems = [
        // {
        //     title: "Home",
        //     href: "/",
        //     description: "",
        // },
        // {
        //     title: "Articles",
        //     description: "Managing a small business today is already tough.",
        //     items: [
        //         {
        //             title: "Blogs",
        //             href: "/blogs",
        //         },
        //     ],
        // },
    ];

    return (
        <div className="w-full py-20 lg:py-40 bg-foreground text-background">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className="flex gap-8 flex-col items-start">
                        <div className="flex gap-2 flex-col">
                            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                                Pinas AutoFinder
                            </h2>
                            <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                                Best secondhand car finder in the Philippines
                            </p>
                        </div>
                        <div className="flex gap-20 flex-row">
                            
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-10 items-start">
                        {navigationItems.map((item) => (
                            <div
                                key={item.title}
                                className="flex text-base gap-1 flex-col items-start"
                            >
                                <div className="flex flex-col gap-2">
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-xl">{item.title}</span>
                                        </Link>
                                    ) : (
                                        <p className="text-xl">{item.title}</p>
                                    )}
                                    {item.items &&
                                        item.items.map((subItem) => (
                                            <Link
                                                key={subItem.title}
                                                href={subItem.href}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-background/75">
                                                    {subItem.title}
                                                </span>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};