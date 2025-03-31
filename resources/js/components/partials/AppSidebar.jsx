import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { visit } from "@/Utils/Functions"
import { VersionSwitcher } from "./VersionSwitcher"
import { GaugeCircle } from "lucide-react"
import { User } from "lucide-react"
import { Globe } from "lucide-react"
import { Settings } from "lucide-react"
import { ShieldCheck } from "lucide-react"
import { Activity } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { compact, get, includes } from "lodash"
import { Permissions } from "@/Utils/Constants/RolesPermissions"
import { Car } from "lucide-react"

export function AppSidebar({ ...props }) {

    const { auth } = usePage().props;
    const permissions = get(auth, "permissions", []);

    // Navigation Routes List.
    const data = {
        versions: ["1.0.0"],
        navRoutes: [
            {
                title: "Main",
                url: "#",
                items: compact([
                    {
                        title: "Dashboard",
                        route: "dashboard",
                        icon: (<GaugeCircle size={48} />),
                    },
                    includes(permissions, Permissions.ScraperProcessView) && {
                        title: "Scraper Monitoring",
                        route: "scraper-processes",
                        icon: (<Globe size={48} />),
                    },
                    includes(permissions, Permissions.CarView) && {
                        title: "Cars Management",
                        route: "cars",
                        icon: (<Car size={48} />),
                    },
                ]),
            },
            {
                title: "Administrator",
                url: "#",
                items: compact([
                    includes(permissions, Permissions.UserView) && {
                        title: "User Management",
                        route: "users",
                        icon: (<User size={48} />),
                    },
                    includes(permissions, Permissions.PermissionView) && {
                        title: "Roles and Permissions",
                        route: "roles-permissions",
                        icon: (<ShieldCheck size={48} />),
                    },
                    includes(permissions, Permissions.ActivityLogView) && {
                        title: "Activity Logs",
                        route: "activity-logs",
                        icon: (<Activity size={48} />),
                    },
                    includes(permissions, Permissions.SettingsView) && {
                        title: "Settings",
                        route: "settings",
                        icon: (<Settings size={48} />),
                    },
                ]),
            },
        ],
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={data.versions}
                    defaultVersion={data.versions[0]}
                />
                {/* <SearchForm /> */}
            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {data.navRoutes.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <button onClick={(e) => visit(e, item.route)}>{item.icon} {item.title}</button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <div className="flex justify-center text-muted">Developed by: Albert Belgera</div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
