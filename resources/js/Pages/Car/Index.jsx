import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { CarsTable } from "@/components/partials/tables/CarsTable";

export default function Index() {
    const breadcrumbItems = [
        {
            title: "Car Management",
            href: "#",
            current: true, 
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}> 
            <CarsTable />
        </AuthenticatedLayout>
    )
}
