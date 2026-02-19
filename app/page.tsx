import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        {/* Main Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Supremo Barbershop</h1>
          <p className="text-xl text-gray-600">
            Premium barbering services at your convenience
          </p>
        </div>

        {/* Circular Logo Section */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-full border-4 border-gray-100 shadow-lg bg-white">
          <Image
            src="/images/supremo.png"
            alt="Supremo Barbershop Logo"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl px-4">
          <Link href={ROUTES.guestBook} className="w-full">
            <Button size="lg" variant="outline" className="w-full h-24 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Guest Booking</span>
                <span className="text-xs text-gray-600">No account needed</span>
              </div>
            </Button>
          </Link>

          <Link href={ROUTES.login} className="w-full">
            <Button size="lg" variant="outline" className="w-full h-24 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Customer Login</span>
                <span className="text-xs text-gray-600">View bookings & history</span>
              </div>
            </Button>
          </Link>

          <Link href={ROUTES.login} className="w-full">
            <Button size="lg" variant="outline" className="w-full h-24 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Staff Login</span>
                <span className="text-xs text-gray-600">Employee access</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-3 w-full max-w-5xl px-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Expert Barbers</h3>
            <p className="text-sm text-gray-600">Skilled professionals with years of experience</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Quality Service</h3>
            <p className="text-sm text-gray-600">Premium cuts and styling techniques</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Easy Booking</h3>
            <p className="text-sm text-gray-600">Simple online scheduling system</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}