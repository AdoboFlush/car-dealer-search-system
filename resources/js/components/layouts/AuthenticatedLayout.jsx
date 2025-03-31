import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import _ from "lodash"
import { ThemeToggle } from "../theme-toggle"
import { Fragment, useEffect } from "react"
import MainContainer from "./MainContainer"
import { AppSidebar } from "../partials/AppSidebar"
import { NavUser } from "../partials/NavUser"
import { HouseIcon } from "lucide-react"

export default function AuthenticatedLayout({ children, breadcrumbItems = [] }) {
    return (
        <MainContainer>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex justify-between gap-2 border-b px-4 h-16 shrink-0">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">
                                            <HouseIcon size={16}/>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    {_.size(breadcrumbItems) > 0 && breadcrumbItems.map((item, i) => {
                                        if (item?.current) {
                                            return (
                                            <BreadcrumbItem key={`breadcrumb-current-item-${i}`}>
                                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                            );
                                        } else {
                                            return (
                                                <Fragment key={`breadcrumb-item-${i}`}>
                                                    <BreadcrumbItem className="hidden md:block">
                                                        <BreadcrumbLink href={item?.href}>
                                                            {item?.title}
                                                        </BreadcrumbLink>
                                                    </BreadcrumbItem>
                                                    <BreadcrumbSeparator className="hidden md:block" />
                                                </Fragment>
                                            );
                                            
                                        }
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center px-4 gap-2">
                            <NavUser />
                            <ThemeToggle />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-2">
                        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-2" >
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </MainContainer>
    )
}
