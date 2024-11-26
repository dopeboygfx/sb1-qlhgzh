import { ArrowRight, Upload, Shield, Zap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Upload,
    title: 'Smart Compression',
    description: 'AI-powered compression that maintains quality while reducing file size by up to 70%'
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Enterprise-grade encryption and secure cloud storage for all your files'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process files in seconds with our optimized compression algorithms'
  }
];

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      '5 GB Storage',
      'Basic Compression',
      'Email Support',
      '3 Active Projects'
    ]
  },
  {
    name: 'Pro',
    price: '9.99',
    features: [
      '50 GB Storage',
      'Advanced AI Compression',
      'Priority Support',
      'Unlimited Projects',
      'API Access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '29.99',
    features: [
      'Unlimited Storage',
      'Custom Compression Settings',
      '24/7 Support',
      'Team Management',
      'Advanced Analytics',
      'Custom Integration'
    ]
  }
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-dark-900 pt-16 pb-32 overflow-hidden">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative text-center">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                Compress Files Without
                <br />
                Losing Quality
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
                Revolutionary AI-powered file compression that reduces size while maintaining 100% quality. Perfect for professionals and teams.
              </p>
              <div className="mt-10 flex justify-center space-x-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-dark-800 hover:bg-dark-700"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary-500">70%</div>
                <div className="mt-2 text-sm text-gray-400">Average Size Reduction</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary-500">1M+</div>
                <div className="mt-2 text-sm text-gray-400">Files Processed</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary-500">50K+</div>
                <div className="mt-2 text-sm text-gray-400">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-dark-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose CompressAI?
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Experience the future of file compression with our cutting-edge features.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-600">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-400 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-dark-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Choose the perfect plan for your needs
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl ${
                  plan.popular
                    ? 'bg-primary-900/20 border-2 border-primary-500'
                    : 'bg-dark-800'
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 transform -translate-y-1/2">
                    <div className="inline-flex rounded-full bg-primary-500 px-4 py-1 text-sm font-semibold text-white">
                      Popular
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                    <span className="ml-1 text-xl text-gray-400">/month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-primary-500" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      to="/signup"
                      className={`w-full inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold ${
                        plan.popular
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-dark-700 text-white hover:bg-dark-600'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-dark-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="pt-16 pb-12 px-6 sm:pt-20 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-primary-900">Try it free for 14 days.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-primary-200">
                  No credit card required. Cancel anytime.
                </p>
                <Link
                  to="/signup"
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-6 py-3 inline-flex items-center text-base font-medium text-primary-600 hover:bg-primary-50"
                >
                  Sign up for free
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}