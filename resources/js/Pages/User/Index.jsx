import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { UsersTable } from "@/components/partials/tables/UsersTable";
export default function Index() {
    const breadcrumbItems = [
        {
            title: "User Management",
            href: "#",
            current: true, 
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}> 
            <UsersTable />
        </AuthenticatedLayout>
    )
}
