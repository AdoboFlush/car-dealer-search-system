import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "@/Utils/Constants/Settings";
import { useForm } from "@inertiajs/react";
import { get, startCase } from "lodash";
import { Save } from "lucide-react";
import { useEffect } from "react";

export default function Index({settings}) {
    const breadcrumbItems = [
        {
            title: "Settings",
            href: "#",
            current: true,
        },
    ];

    const {toast} = useToast();

    let settingData = {};
    Settings.map((setting) => {
        settingData = {...settingData, [setting.key]: get(settings, setting.key, "")};
    })

    const form = useForm({
        settings: settingData
    });

    useEffect(() => {
        console.log(settings);
    }, []);

    const handleSave = () => {
        form.post(route("settings.update"), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    description: "Settings has been updated.",
                });
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            },
        });
    }

    const handleSettingsChange = (key, value) => {
        form.setData("settings", {...form.data.settings, [key]: value});
    }

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Configure your application settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mt-6 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
                        {Settings.map((setting, k) => (
                            <div key={k} className="mb-4">
                                {setting.type === "checkbox" && (
                                    <>
                                        <div className="items-top flex space-x-2">
                                            <Checkbox 
                                                id={setting.key} 
                                                name={setting.key} 
                                                checked={get(form.data.settings, setting.key, 0) == 1 ? true : false}
                                                onCheckedChange={(checked) => {
                                                    handleSettingsChange(setting.key, checked)
                                                }}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor={setting.key}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {startCase(setting.key)}
                                                </label>
                                                <p className="text-sm text-muted-foreground">
                                                    {setting.description}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {setting.type === "textbox" && (
                                    <>
                                        <label className="block text-sm mb-4">
                                            <span className="font-medium">{startCase(setting.key)}</span>
                                            <span className="ml-3 font-small text-muted-foreground">( {setting.description} )</span>
                                        </label>

                                        <Input
                                            name={setting.key}
                                            value={get(form.data.settings, setting.key, "")}
                                            onChange={(e) => {
                                                handleSettingsChange(setting.key, e.target.value)
                                            }}
                                            className="max-w-sm"
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} className="ml-auto">
                        <Save />
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </AuthenticatedLayout>
    )
}
