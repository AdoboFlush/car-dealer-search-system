import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import { FormTextError } from "@/components/partials/FormTextError"
import React from "react"
import _ from "lodash"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { Key } from "lucide-react"
import { KeySquare } from "lucide-react"

export function DialogChangePassword({ successCb = null }) {
    const { toast } = useToast();
    const form = useForm({
        currentPassword: "",
        password: "",
        passwordConfirmation: "",
    });

    const submit = () => {
        form.post(route("profile.password.change"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                if (_.isFunction(successCb)) {
                    successCb();
                }
                toast({
                    variant: "success",
                    description: "New password has been created.",
                });
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        });
    };

    const onChange = (event) =>
        form.setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    size="sm"
                    variant="secondary"
                >
                    <KeySquare />
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[425px] lg:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        
                    <div>
                            <Input
                                type="password"
                                name="currentPassword"
                                value={form.data.currentPassword}
                                onChange={onChange}
                                placeholder="Old Password"
                            />
                            <FormTextError>{form.errors.currentPassword}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="password"
                                name="password"
                                value={form.data.password}
                                onChange={onChange}
                                placeholder="New Password"
                            />
                            <FormTextError>{form.errors.password}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="password"
                                name="passwordConfirmation"
                                value={form.data.passwordConfirmation}
                                onChange={onChange}
                                placeholder="Confirm New Password"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex item-center justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" variant="outline" onClick={submit}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
