import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-6 py-10">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Supremo Barbershop
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium">
            Premium barbering services at your convenience
          </p>
        </div>

        {/* Brand Logo Section */}
        <div className="relative group transition-transform duration-300 hover:scale-105">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <Image
            src="/images/supremo.png"
            alt="Supremo Barbershop Logo"
            width={220}
            height={220}
            priority
            className="relative rounded-full shadow-xl border-4 border-white bg-white"
          />
        </div>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-4xl px-4 md:grid-cols-3 pt-4">
          <Link href={ROUTES.guestBook}>
            <Button size="lg" variant="outline" className="w-full h-24 border-2 hover:border-black hover:bg-gray-50 transition-all duration-200">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-bold">Guest Booking</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No account needed
                </span>
              </div>
            </Button>
          </Link>

          <Link href={ROUTES.login}>
            <Button size="lg" variant="outline" className="w-full h-24 border-2 hover:border-black hover:bg-gray-50 transition-all duration-200">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-bold">Customer Login</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View bookings & history
                </span>
              </div>
            </Button>
          </Link>

          <Link href={ROUTES.login}>
            <Button size="lg" variant="outline" className="w-full h-24 border-2 hover:border-black hover:bg-gray-50 transition-all duration-200">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-bold">Staff Login</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee access
                </span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-6 pt-12 w-full max-w-5xl md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1 w-12 bg-black mb-4" />
            <h3 className="font-bold text-lg mb-2">Expert Barbers</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Skilled professionals with years of experience in modern and classic cuts.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1 w-12 bg-black mb-4" />
            <h3 className="font-bold text-lg mb-2">Quality Service</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              We use premium tools and styling products to ensure a superior finish.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1 w-12 bg-black mb-4" />
            <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Our streamlined online system lets you book your chair in under a minute.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}