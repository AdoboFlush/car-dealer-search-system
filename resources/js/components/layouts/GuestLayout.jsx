import { ThemeProvider } from "../theme-provider";
import { Toaster } from "../ui/toaster";

export default function GuestLayout({children}) {
    return (
        <ThemeProvider>
            {children}
            <Toaster />
        </ThemeProvider>
    );
}
