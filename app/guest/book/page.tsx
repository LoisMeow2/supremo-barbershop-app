'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/layout/main-layout';
import { HaircutSelector } from '@/components/booking/haircut-selector';
import { DateTimePicker } from '@/components/booking/datetime-picker';
import { BarberSelector } from '@/components/booking/barber-selector';
import { db } from '@/lib/supabase';
import { Service, Barber } from '@/lib/types';

export default function GuestBookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [guestInfo, setGuestInfo] = useState({
    email: '', // This acts as the 'Name' field for your database
    phone: '',
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedHaircut, setSelectedHaircut] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await db.getServices();
    if (!error && data) {
      const haircutServices = data.filter(
        (s: Service) => s.service_category === 'Haircut'
      );
      setServices(haircutServices);
    }
    setServicesLoading(false);
  };

  const handleNextStep = () => {
    // Validation for Step 1: Name (email) and Haircut are mandatory
    if (step === 1) {
      if (!guestInfo.email.trim()) {
        setError('Full Name is required to proceed.');
        return;
      }
      if (!selectedHaircut) {
        setError('Please select a haircut style.');
        return;
      }
    }
    
    if (step === 2 && (!selectedService || !selectedDate || !selectedTime)) {
      setError('Please select service, date, and time');
      return;
    }
    
    if (step === 3 && !selectedBarber) {
      setError('Please select a barber');
      return;
    }

    setError('');
    setStep(step + 1);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/guest/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          service_id: selectedService?.service_id,
          barber_id: selectedBarber?.barber_id,
          amount_paid: selectedService?.price || 0,
          payment_method: 'Cash',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Checkout failed');
        return;
      }

      router.push(`/receipt?transaction_id=${data.data.guest_transaction_id}&email=${guestInfo.email}`);
    } catch (err) {
      setError('An error occurred during checkout');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                  s <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`h-1 w-12 transition-colors ${
                    s < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Guest Info & Haircut Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Guest Information & Style Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Your Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={guestInfo.email}
                    className={error && !guestInfo.email ? 'border-red-500' : ''}
                    onChange={(e) => {
                      setError('');
                      setGuestInfo({ ...guestInfo, email: e.target.value });
                    }}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This name will be used for your booking and receipt.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone (Optional)</label>
                  <Input
                    type="tel"
                    placeholder="+63 9XXXXXXXXX"
                    value={guestInfo.phone}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4 text-lg">Select Haircut Style <span className="text-red-500">*</span></h3>
                <HaircutSelector
                  onSelect={setSelectedHaircut}
                  selectedId={selectedHaircut?.id}
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <Button onClick={handleNextStep} className="w-full h-12 text-lg">
                Continue to Service Selection
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service & Date/Time */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Service & Appointment Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {servicesLoading ? (
                <div className="py-10 text-center text-gray-500">Loading available services...</div>
              ) : (
                <>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Service</h3>
                    <div className="grid gap-3">
                      {services.map((service) => (
                        <Card
                          key={service.service_id}
                          className={`cursor-pointer transition-all border-2 ${
                            selectedService?.service_id === service.service_id
                              ? 'border-blue-500 bg-blue-50/50'
                              : 'hover:border-gray-300 border-transparent bg-gray-50'
                          }`}
                          onClick={() => setSelectedService(service)}
                        >
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="font-bold text-gray-900">{service.service_name}</p>
                              <p className="text-sm text-gray-500">
                                {service.service_description}
                              </p>
                            </div>
                            <p className="text-xl font-black text-blue-600">₱{service.price}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <DateTimePicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                  />
                </>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Barber Selection */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Barber</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <BarberSelector
                onSelect={setSelectedBarber}
                selectedId={selectedBarber?.barber_id}
              />

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation & Checkout */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 rounded-xl border bg-gray-50 p-6">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-500">Client Name:</span>
                  <span className="font-bold text-gray-900">{guestInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Haircut Style:</span>
                  <span className="font-semibold">{selectedHaircut?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{selectedService?.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold text-blue-700">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Barber:</span>
                  <span className="font-semibold">
                    {selectedBarber?.barber_fname} {selectedBarber?.barber_lname}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl">
                  <span className="font-bold text-gray-900">Total Price:</span>
                  <span className="font-black text-blue-600">₱{selectedService?.price}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  <strong>Notice:</strong> Payment is due upon arrival at the shop. We currently only accept Cash.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Processing...' : 'Complete Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}