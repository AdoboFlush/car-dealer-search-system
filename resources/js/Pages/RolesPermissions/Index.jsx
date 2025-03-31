import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Permissions } from "@/Utils/Constants/RolesPermissions";
import useAsyncEffect from "use-async-effect";
import { fetchRolePermissions, fetchRoles } from "@/API/RolesPermission";
import { isEmpty } from "lodash";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function Index() {

    const breadcrumbItems = [
        {
            title: "Roles and Permissions",
            href: "#",
            current: true,
        },
    ];

    const [selectedRole, setSelectedRole] = useState({});
    const [roles, setRoles] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);

    const [open, setOpen] = useState(false)
    const {toast} = useToast();

    const form = useForm({
        permissions: [],
    });

    useAsyncEffect( async () => {
        const res = await fetchRoles();
        if(res.data) {
            setRoles(res.data);
            let defaultRole = res.data[0];
            setSelectedRole(defaultRole);
            setRolePermissions( !isEmpty(defaultRole.permissions) ? defaultRole.permissions.map((permission) => permission.name) : [] );
        }
    }, []);

    const handleRoleChange = async (role) => {
        const res = await fetchRolePermissions({role: role.id});
        if(res.data) {
            setRolePermissions( !isEmpty(res.data.data) ? res.data.data.map((permission) => permission.name) : [] );
        }
        setSelectedRole(role);
        setOpen(false);
    }

    const handlePermissionChange = (permission) => {
        const updatedPermissions = rolePermissions.includes(permission)
            ? rolePermissions.filter((existingPermission) => existingPermission !== permission)
            : [...rolePermissions, permission]
        setRolePermissions(updatedPermissions);
        form.setData({ permissions: updatedPermissions });
    }

    const handleSave = () => {
        form.post(route("roles-permissions.sync", { role: selectedRole.id }), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    description: "Permissions has been updated.",
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

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Role Permissions</CardTitle>
                    <CardDescription>Select a role and manage its permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="justify-between w-full md:w-[200px]"
                                >
                                    {selectedRole.name}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full md:w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search role..." />
                                    <CommandList>
                                        <CommandEmpty>No role found.</CommandEmpty>
                                        <CommandGroup>
                                            {roles.map((role) => (
                                                <CommandItem
                                                    key={role.id}
                                                    onSelect={() => handleRoleChange(role)}
                                                >
                                                    <Check
                                                        className={cn("mr-2 h-4 w-4", selectedRole.name === role.name ? "opacity-100" : "opacity-0")}
                                                    />
                                                    {role.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="h-[600px] w-full rounded-md border p-4 overflow-auto">
                            <div className="grid gap-4">
                                {Object.keys(Permissions).map((permissionKey, k) => (
                                    <div key={k} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={Permissions[permissionKey]}
                                            checked={ !isEmpty(rolePermissions) ? rolePermissions.includes(Permissions[permissionKey]) : false }
                                            onCheckedChange={() => handlePermissionChange(Permissions[permissionKey])}
                                        />
                                        <label
                                            htmlFor={Permissions[permissionKey]}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {Permissions[permissionKey]}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
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
