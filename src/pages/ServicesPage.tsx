import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { Service } from '../lib/supabase';
import { SectionHeader } from '../components/ui';
import {
  Snowflake,
  Wrench,
  Droplet,
  Zap,
  Thermometer,
  Settings,
  Siren,
  Wind,
  Fan,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Refrigerator: Snowflake,
  Wind: Wind,
  Fan: Fan,
  Wrench: Wrench,
  Droplet: Droplet,
  Zap: Zap,
  Thermometer: Thermometer,
  Settings: Settings,
  Siren: Siren,
};

export default function ServicesPage() {
  const { navigate } = useApp();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('services').select('*').order('sort_order');
      if (data) setServices(data);
      setLoading(false);
    })();
  }, []);

  const processSteps = [
    { num: '01', title: 'Book a Service', desc: 'Submit a service request online or call us directly.' },
    { num: '02', title: 'Diagnosis', desc: 'Our technician visits and diagnoses the issue on-site.' },
    { num: '03', title: 'Repair', desc: 'We fix the problem using genuine parts and proven methods.' },
    { num: '04', title: 'Quality Check', desc: 'We test the appliance to ensure everything works perfectly.' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Repair & Maintenance Services</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Expert repair and maintenance for all your refrigeration and air conditioning needs
          </p>
        </div>
      </div>

      {/* Services grid */}
      <section className="section">
        <div className="container-custom">
          <SectionHeader
            title="Our Service Offerings"
            subtitle="From minor repairs to major overhauls, we handle it all"
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                  <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = iconMap[service.icon || ''] || Wrench;
                return (
                  <div key={service.id} className="card-hover p-6 group flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-colors">
                        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                          {service.is_emergency && (
                            <span className="badge bg-error-500 text-white">24/7</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{service.description}</p>
                    <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                      <button onClick={() => navigate('/booking')} className="btn-secondary text-sm py-2 px-4">
                        Book Service
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeader title="How It Works" subtitle="Simple, fast, and reliable service process" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-3 w-6 h-6 text-gray-300 dark:text-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: '3-Month Service Warranty', desc: 'All repairs are backed by our service warranty.' },
              { icon: Clock, title: 'Fast Response', desc: 'Same-day service for most repair requests.' },
              { icon: CheckCircle2, title: 'Genuine Parts Only', desc: 'We use only authentic, quality spare parts.' },
            ].map((item, i) => (
              <div key={i} className="card-hover p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-success-50 dark:bg-success-950/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-success-600 dark:text-success-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-secondary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Book a Service?</h2>
          <p className="text-primary-100 text-lg mb-8">Get your appliance running like new again</p>
          <button onClick={() => navigate('/booking')} className="btn bg-white text-primary-700 hover:bg-gray-100 text-base px-8 py-4">
            Book a Repair
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
