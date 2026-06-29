import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

// Import the actual payment logos
import visaLogo from "@/assets/payment-logos/visa.svg";
import mastercardLogo from "@/assets/payment-logos/mastercard.svg";
import applePayLogo from "@/assets/payment-logos/apple-pay.svg";
import googlePayLogo from "@/assets/payment-logos/google-pay.svg";
import amexLogo from "@/assets/payment-logos/american-express.svg";
import paypalLogo from "@/assets/payment-logos/paypal.svg";

const PaymentMethods = () => {
  const { language } = useLanguage();

  const paymentMethods = [
    {
      name: "Visa",
      icon: <OptimizedImage src={visaLogo} alt="Visa" className="h-5 w-auto" width={40} height={20} priority />,
    },
    {
      name: "Mastercard",
      icon: <OptimizedImage src={mastercardLogo} alt="Mastercard" className="h-5 w-auto" width={40} height={20} priority />,
    },
    {
      name: "Apple Pay",
      icon: <OptimizedImage src={applePayLogo} alt="Apple Pay" className="h-5 w-auto" width={40} height={20} priority />,
    },
    {
      name: "Google Pay",
      icon: <OptimizedImage src={googlePayLogo} alt="Google Pay" className="h-5 w-auto" width={40} height={20} priority />,
    },
    {
      name: "PayPal",
      icon: <OptimizedImage src={paypalLogo} alt="PayPal" className="h-5 w-auto" width={40} height={20} priority />,
    },
  ];

  return (
    <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
      <div className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          <Shield className="w-4 h-4 text-green-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            {language === 'ar' ? 'طرق الدفع الآمنة' : 'Secure Payment Methods'}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2.5">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="flex items-center justify-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer animate-fade-in"
              title={method.name}
            >
              {method.icon}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>
            {language === 'ar'
              ? 'SSL مشفر • حماية كاملة للبيانات'
              : 'SSL Encrypted • Full Data Protection'
            }
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PaymentMethods;