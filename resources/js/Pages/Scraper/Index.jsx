import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { ScraperProcessesTable } from "@/components/partials/tables/ScraperProcessesTable";

export default function Index() {
    const breadcrumbItems = [
        {
            title: "Scraper Monitoring",
            href: "#",
            current: true, 
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}> 
            <ScraperProcessesTable />
        </AuthenticatedLayout>
    )
}
