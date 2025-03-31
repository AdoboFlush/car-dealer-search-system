import React from "react";
import GuestLayout from "../layouts/GuestLayout";
import { OrigamiIcon } from "lucide-react";
import { CarIcon } from "lucide-react";

export default function AuthLayout({children}) {
    return (
        <GuestLayout>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <a href="/" className="flex items-center gap-2 self-center font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <CarIcon className="size-4" />
                        </div>
                        Pinas AutoFinder
                    </a>
                    {children}
                </div>
            </div>
        </GuestLayout>
    );
};