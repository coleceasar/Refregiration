import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  CheckCircle2,
  Loader2,
  Search,
  Copy,
} from 'lucide-react';

const applianceTypes = [
  'Refrigerator',
  'Freezer',
  'Fridge',
  'Air Conditioner',
  'AC Fan',
  'Other',
];

export default function BookingPage() {
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    location: '',
    appliance_type: '',
    brand: '',
    problem_description: '',
    preferred_visit_date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateRef = () => {
    const prefix = 'WAP';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const reference = generateRef();
    const { error: insertError } = await supabase.from('bookings').insert({
      ...form,
      reference_number: reference,
    });

    if (insertError) {
      setError('Failed to submit your request. Please try again or call us.');
      setSubmitting(false);
    } else {
      setSuccess(reference);
      setSubmitting(false);
      setForm({
        full_name: '',
        phone_number: '',
        email: '',
        location: '',
        appliance_type: '',
        brand: '',
        problem_description: '',
        preferred_visit_date: '',
      });
    }
  };

  const trackBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError(null);
    setTrackingResult(null);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('reference_number', trackingInput.trim().toUpperCase())
      .maybeSingle();
    if (error || !data) {
      setTrackingError('No booking found with that reference number. Please check and try again.');
    } else {
      setTrackingResult(data);
    }
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    'In Progress': 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    Completed: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    Cancelled: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Book a Repair Service</h1>
          <p className="text-primary-100 text-lg">Fill out the form below and our team will get back to you</p>
        </div>
      </div>

      <section className="section">
        <div className="container-custom max-w-4xl">
          {success ? (
            <div className="card p-8 md:p-12 text-center animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-success-50 dark:bg-success-950/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Booking Submitted Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for choosing Wapendwa. We've received your service request and will
                contact you shortly.
              </p>
              <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Reference Number</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 tracking-wider">{success}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(success)}
                    className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    aria-label="Copy reference"
                  >
                    <Copy className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Save this number to track your service request status
                </p>
              </div>
              <button onClick={() => setSuccess(null)} className="btn-outline">
                Book Another Service
              </button>
            </div>
          ) : (
            <div className="card p-6 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Service Request Form</h2>
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-error-50 dark:bg-error-950/30 text-error-700 dark:text-error-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="label">Location *</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="e.g. Westlands, Nairobi"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Appliance Type *</label>
                    <select
                      name="appliance_type"
                      value={form.appliance_type}
                      onChange={handleChange}
                      required
                      className="input"
                    >
                      <option value="">Select appliance type</option>
                      {applianceTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Brand</label>
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g. Samsung, LG, Daikin"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Problem Description *</label>
                  <textarea
                    name="problem_description"
                    value={form.problem_description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input resize-none"
                    placeholder="Describe the problem you're experiencing..."
                  />
                </div>
                <div>
                  <label className="label">Preferred Visit Date</label>
                  <input
                    name="preferred_visit_date"
                    type="date"
                    value={form.preferred_visit_date}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full text-base py-4 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Track booking */}
          <div className="card p-6 md:p-8 mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Track Your Service Request
            </h3>
            <form onSubmit={trackBooking} className="flex flex-col sm:flex-row gap-3">
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter your reference number (e.g. WAP-ABC123)"
                className="input flex-1"
              />
              <button type="submit" className="btn-outline whitespace-nowrap">
                Track Request
              </button>
            </form>
            {trackingError && (
              <p className="text-error-500 text-sm mt-3">{trackingError}</p>
            )}
            {trackingResult && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">{trackingResult.reference_number}</span>
                  <span className={`badge ${statusColors[trackingResult.status] || statusColors.Pending}`}>
                    {trackingResult.status}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div><strong>Name:</strong> {trackingResult.full_name}</div>
                  <div><strong>Appliance:</strong> {trackingResult.appliance_type}</div>
                  <div><strong>Phone:</strong> {trackingResult.phone_number}</div>
                  <div><strong>Location:</strong> {trackingResult.location}</div>
                  <div><strong>Booked:</strong> {new Date(trackingResult.created_at).toLocaleDateString()}</div>
                  {trackingResult.preferred_visit_date && (
                    <div><strong>Preferred Visit:</strong> {trackingResult.preferred_visit_date}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
