import { useApp } from '../context/AppContext';
import { SectionHeader } from '../components/ui';
import {
  CheckCircle2,
  Award,
  ShieldCheck,
  Clock,
  Heart,
  ArrowRight,
  Target,
  Eye,
} from 'lucide-react';

export default function AboutPage() {
  const { navigate } = useApp();

  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Happy Customers' },
    { value: '1200+', label: 'Repairs Completed' },
    { value: '24/7', label: 'Emergency Service' },
  ];

  const values = [
    { icon: Award, title: 'Excellence', desc: 'We strive for excellence in every repair and installation we undertake.' },
    { icon: ShieldCheck, title: 'Integrity', desc: 'Honest pricing, genuine parts, and transparent communication always.' },
    { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is the measure of our success.' },
    { icon: Clock, title: 'Reliability', desc: 'We show up on time and deliver on our promises.' },
  ];

  const services = [
    'Selling genuine cooling appliances',
    'Professional installation services',
    'Routine maintenance contracts',
    'Expert repair services',
    'Residential & commercial equipment',
    'Affordable & transparent pricing',
    'Experienced certified technicians',
    'Fast and reliable service',
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5463575/pexels-photo-5463575.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="About"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 to-gray-950/60" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Wapendwa</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Wapendwa Refrigeration & Air Conditioning Services has been serving the community for
              over a decade, providing top-quality cooling solutions for both residential and
              commercial clients. We are your trusted one-stop destination for all refrigeration
              and air conditioning needs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-600">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader title="Our Story" center={false} />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Founded with a passion for quality service, Wapendwa Refrigeration & Air
                Conditioning Services started as a small repair shop and has grown into a trusted
                name in the cooling industry. Our journey has been built on a foundation of honest
                work, genuine parts, and exceptional customer service.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Today, we offer a comprehensive range of services from selling top-brand appliances
                to expert repair and maintenance. Our team of certified technicians brings years of
                experience to every job, ensuring your cooling equipment runs efficiently and
                reliably.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                <img
                  src="https://images.pexels.com/photos/3964617/pexels-photo-3964617.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Our work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4] mt-8">
                <img
                  src="https://images.pexels.com/photos/6996088/pexels-photo-6996088.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Our work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide reliable, affordable, and professional refrigeration and air
                conditioning services that exceed customer expectations. We are committed to
                keeping your cooling equipment running at peak performance.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 rounded-2xl bg-secondary-50 dark:bg-secondary-950/50 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To be the leading and most trusted refrigeration and air conditioning service
                provider in the region, known for quality workmanship, genuine products, and
                exceptional customer care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-custom">
          <SectionHeader title="Our Core Values" subtitle="The principles that guide everything we do" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div key={i} className="card-hover p-6 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
                  <val.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{val.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-secondary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Partner With Us Today</h2>
          <p className="text-primary-100 text-lg mb-8">Experience the Wapendwa difference</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/booking')} className="btn bg-white text-primary-700 hover:bg-gray-100 text-base px-8 py-4">
              Book a Service
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/contact')} className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 text-base px-8 py-4">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
