import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "@inertiajs/react";

export const Hero = () => {
    return (
        <div className="relative bg-gray-900 text-white">
            <img
                src="/images/hero-banner.jpg"
                alt="Second-hand cars"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-[500px] text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Find Your Perfect Second-Hand Car
                </h1>
                <p className="text-lg md:text-xl mb-6">
                    Explore a wide range of pre-owned cars at unbeatable prices.
                </p>
                <Link href="/browse-cars">
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Search /> Browse Cars <MoveRight />
                    </Button>
                </Link>
            </div>
        </div>
    );
};