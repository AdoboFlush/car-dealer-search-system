import { ThemeProvider } from "../theme-provider";
import { Toaster } from "../ui/toaster";

export default function MainContainer({children}) {
    return (
        <ThemeProvider>
            {children}
            <Toaster />
        </ThemeProvider>
    );
}