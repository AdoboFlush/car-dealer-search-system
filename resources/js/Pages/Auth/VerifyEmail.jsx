import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from "@inertiajs/react"
import AuthLayout from "@/components/partials/AuthLayout"

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Verify Email</CardTitle>
                    <CardDescription>
                        <div>
                            Thanks for signing up! Before getting started, could you verify
                            your email address by clicking on the link we just emailed to
                            you? If you didn't receive the email, we will gladly send you
                            another.
                        </div>
                        {status === 'verification-link-sent' && (
                            <div>
                                A new verification link has been sent to the email address
                                you provided during registration.
                            </div>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <Button type="submit" disabled={processing}>
                            Resend Verification Email
                        </Button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Log Out
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
