
import { Camera, Search, DollarSign, Globe, ShoppingCart, CheckCircle } from 'lucide-react';

const features = [
  {
    name: 'AI Coin Recognition',
    description: 'Upload 2-5 images and our AI will identify the coin type, year, grade, and any errors.',
    icon: <Camera className="h-6 w-6 text-coin-gold" />
  },
  {
    name: 'Real-time Valuation',
    description: 'Get accurate market valuation based on current prices from NGC, NumisMaster, and eBay.',
    icon: <DollarSign className="h-6 w-6 text-coin-gold" />
  },
  {
    name: 'Global Marketplace',
    description: 'Buy and sell coins with collectors worldwide through auctions or direct sales.',
    icon: <ShoppingCart className="h-6 w-6 text-coin-gold" />
  },
  {
    name: 'Multiple Languages',
    description: 'Use the platform in 10 different languages, making it accessible worldwide.',
    icon: <Globe className="h-6 w-6 text-coin-gold" />
  },
];

const FeatureSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="section-heading">Powered by Advanced Technology</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Our platform combines AI image recognition with market data to provide a comprehensive coin service.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute h-12 w-12 rounded-md bg-white flex items-center justify-center border-2 border-coin-gold">
                  {feature.icon}
                </div>
                <div className="pl-16">
                  <h3 className="text-lg font-medium text-coin-blue">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="uppercase tracking-wide text-sm text-coin-gold font-semibold">How It Works</div>
              <h3 className="mt-2 text-3xl leading-8 font-serif font-medium text-coin-blue">
                Simple Process, Powerful Results
              </h3>
              <p className="mt-4 text-lg text-gray-500">
                Our AI-driven platform makes coin identification, valuation, and trading accessible to everyone.
              </p>
              <div className="mt-6">
                <div className="flex items-start mt-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-medium text-gray-700">Upload photos</span> of your coin (2-5 angles)
                  </p>
                </div>
                <div className="flex items-start mt-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-medium text-gray-700">Get instant identification</span> and valuation from our AI
                  </p>
                </div>
                <div className="flex items-start mt-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-medium text-gray-700">List for auction or sale</span> with complete information
                  </p>
                </div>
                <div className="flex items-start mt-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-medium text-gray-700">Connect with buyers</span> from around the world
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-coin-blue flex items-center justify-center">
              <div className="relative h-full w-full overflow-hidden">
                <img 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-none"
                  style={{ filter: 'grayscale(0.3)' }}
                  src="https://images.unsplash.com/photo-1620428268482-cf1851a36764?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80" 
                  alt="Coin collecting" 
                />
                <div className="absolute inset-0 bg-coin-blue mix-blend-multiply opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
