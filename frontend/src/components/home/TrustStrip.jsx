import { Truck, ShieldCheck, Package, MapPin } from 'lucide-react';

export function TrustStrip() {
  const features = [
    {
      icon: <Truck className="h-6 w-6 text-brand-purple" />,
      title: "Free Shipping",
      description: "On orders over ₹499"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-purple" />,
      title: "Secure Payments",
      description: "100% safe checkout"
    },
    {
      icon: <Package className="h-6 w-6 text-brand-purple" />,
      title: "Quality Products",
      description: "Made with care"
    },
    {
      icon: <MapPin className="h-6 w-6 text-brand-purple" />,
      title: "Easy Tracking",
      description: "Track your orders instantly"
    }
  ];

  return (
    <section className="w-full bg-white border-t border-b border-foreground/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">{feature.title}</h4>
              <p className="text-foreground/60 text-sm font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
