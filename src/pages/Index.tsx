
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import { ArrowRight, Shield, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        
        {/* Testimonials */}
        <section className="coin-section bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="section-heading">Trusted by Collectors Worldwide</h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Join thousands of numismatists who trust our platform for coin identification and trading.
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="text-4xl font-serif text-coin-gold">"</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "The AI identification was spot on! It recognized my rare Greek drachma and provided an accurate valuation that helped me sell it for a fair price."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coin-blue text-white">
                      AS
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Alex Stamatis</h3>
                    <p className="text-sm text-gray-500">Coin Collector, Athens</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="text-4xl font-serif text-coin-gold">"</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "I've been collecting coins for 20 years, and this platform makes it so easy to identify and trade. The multi-language support is fantastic for international transactions."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coin-blue text-white">
                      JL
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Jean Leclair</h3>
                    <p className="text-sm text-gray-500">Numismatist, Paris</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="text-4xl font-serif text-coin-gold">"</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "The auction system is seamless and the AI grading is surprisingly accurate. I've discovered valuable error coins I didn't even know I had!"
                </p>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coin-blue text-white">
                      RW
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Robert Williams</h3>
                    <p className="text-sm text-gray-500">Dealer, New York</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-coin-blue py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="pt-10 pb-12 px-6 sm:px-16">
                <div className="text-center">
                  <h2 className="text-3xl font-serif font-bold text-coin-blue">Ready to discover your coin's value?</h2>
                  <p className="mt-4 text-lg text-gray-600">
                    Join thousands of collectors who use our AI-powered platform to identify, value, and trade coins.
                  </p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="coin-button text-center">
                    Get Started
                  </button>
                  <button className="coin-button-outline text-center">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="px-6 py-8 sm:px-16 bg-gray-50 border-t">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div className="flex items-start">
                    <Shield className="h-8 w-8 text-coin-gold" />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Secure Transactions</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        All payments and auctions are secured and monitored.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-8 w-8 text-coin-gold" />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Global Community</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Connect with collectors and dealers worldwide.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-8 w-8 text-coin-gold" />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Real-time Updates</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Get notifications on bids and price changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
