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
import { useForm } from "@inertiajs/react"
import { FormTextError } from "@/components/partials/FormTextError"
import AuthLayout from "@/components/partials/AuthLayout"
import { useToast } from "@/hooks/use-toast"

export default function Register({
    className,
}) {
    const {toast} = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    description: "Your account has been created.",
                });
                
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Register</CardTitle>
                    <CardDescription>
                        Create your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Username"
                                />
                                <FormTextError>{errors.name}</FormTextError>
                            </div>

                            <div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email"
                                />
                                <FormTextError>{errors.email}</FormTextError>
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                />
                                <FormTextError>{errors.password}</FormTextError>
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm Password"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Create your account
                            </Button>

                            <div className="mt-4 text-center text-sm">
                                You already have an account?{" "}
                                <a href={route('login')} className="underline underline-offset-4">
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
