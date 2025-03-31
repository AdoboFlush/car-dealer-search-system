import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { ActivityLogTable } from "@/components/partials/tables/ActivityLogsTable";
export default function Index() {
    const breadcrumbItems = [
        {
            title: "Activity Logs",
            href: "#",
            current: true, 
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}> 
            <ActivityLogTable />
        </AuthenticatedLayout>
    )
}
