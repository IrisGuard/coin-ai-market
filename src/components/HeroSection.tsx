
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, DollarSign, Coins } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-hero-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-coin-blue sm:text-5xl md:text-6xl">
                <span className="block">Discover the value of your</span>
                <span className="block text-coin-gold font-serif">Collectible Coins</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Upload images of your coins and let our AI instantly identify, grade, and value them. Join the world's largest global coin marketplace.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/upload" className="coin-button flex items-center justify-center w-full px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10">
                    Upload Coin <Camera size={20} className="ml-2" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/marketplace" className="coin-button-outline flex items-center justify-center w-full px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10">
                    Browse Market <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="relative h-64 w-full sm:h-72 md:h-96 lg:w-full lg:h-full">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-coin-gold opacity-20 animate-pulse"></div>
              <img
                className="absolute top-4 left-4 w-32 h-32 md:w-40 md:h-40 rounded-full object-cover animate-floating"
                src="https://upload.wikimedia.org/wikipedia/commons/d/d9/1879S_Morgan_Dollar_NGC_MS67plus_Obverse.png"
                alt="Gold coin obverse"
              />
              <img
                className="absolute bottom-4 right-4 w-32 h-32 md:w-40 md:h-40 rounded-full object-cover animate-floating"
                style={{ animationDelay: '1s' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/70/1879S_Morgan_Dollar_NGC_MS67plus_Reverse.png"
                alt="Gold coin reverse"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
