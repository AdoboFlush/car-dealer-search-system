import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { Checkbox } from "@/components/ui/checkbox"
import { FormTextError } from "@/components/partials/FormTextError"
import AuthLayout from "@/components/partials/AuthLayout"

export default function Login({
    status,
    canResetPassword,
    className,
}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Login</CardTitle>
                    <CardDescription>
                        Please enter your credentials.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <div className={cn("flex flex-col gap-6", className)}>
                                <form onSubmit={submit} className={cn("flex flex-col gap-6", className)}>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full"
                                                autoComplete="email"
                                                isFocused={true}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Email/Username"
                                            />
                                            <FormTextError>{errors.email}</FormTextError>
                                        </div>
                                        <div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Password"
                                            />

                                            <div className="flex items-center mt-5 space-x-2">
                                                <Checkbox
                                                    id="remember"
                                                    checked={data.remember}
                                                    onCheckedChange={(checked) =>
                                                        setData('remember', checked)
                                                    }
                                                />
                                                <label
                                                    htmlFor="remember"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Remember me
                                                </label>

                                                <a
                                                    href={route('password.request')}
                                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <FormTextError>{errors.password}</FormTextError>
                                        </div>
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            Login
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <a href={route('register')} className="underline underline-offset-4">
                                            Sign up
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    )
}
