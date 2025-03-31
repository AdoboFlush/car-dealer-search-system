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

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Confirm Password</CardTitle>
                    <CardDescription>
                        <div>
                            This is a secure area of the application. Please confirm your
                            password before continuing.
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="grid gap-2">
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                            />
                            <FormTextError>{errors.password}</FormTextError>
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>
                            Confirm
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
