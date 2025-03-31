import GuestLayout from '@/components/layouts/GuestLayout';
import { Header } from '@/components/sections/landing/Header';
import { Footer } from '@/components/sections/landing/Footer';
import CarListing from '@/components/sections/landing/CarList';
import FeaturedCarListing from '@/components/sections/landing/FeaturedCarList';
import { Hero } from '@/components/sections/landing/Hero';

export default function Index() {
    return (
        <GuestLayout>
            <Header />
            <Hero />
            <FeaturedCarListing />
            <Footer />
        </GuestLayout>
    );
}
