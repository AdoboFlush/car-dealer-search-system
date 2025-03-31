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
import { FormTextError } from "@/components/partials/FormTextError"
import AuthLayout from "@/components/partials/AuthLayout"

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot Password</CardTitle>
                    <CardDescription>
                        <div>
                            Forgot your password? No problem. Just let us know your email
                            address and we will email you a password reset link that will
                            allow you to choose a new one.
                        </div>
                        {status && (
                            <div className="mb-2 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                {status}
                            </div>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="grid gap-2">
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
                        <Button type="submit" className="w-full" disabled={processing}>
                            Email Password Reset Link
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
