import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

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
      icon: <img src={visaLogo} alt="Visa" className="h-6 w-auto" />,
    },
    {
      name: "Mastercard",
      icon: <img src={mastercardLogo} alt="Mastercard" className="h-6 w-auto" />,
    },
    {
      name: "Apple Pay",
      icon: <img src={applePayLogo} alt="Apple Pay" className="h-6 w-auto" />,
    },
    {
      name: "Google Pay",
      icon: <img src={googlePayLogo} alt="Google Pay" className="h-6 w-auto" />,
    },
    {
      name: "PayPal",
      icon: <img src={paypalLogo} alt="PayPal" className="h-6 w-auto" />,
    },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
      <div className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="text-base font-semibold text-gray-800">
            {language === 'ar' ? 'طرق الدفع الآمنة' : 'Secure Payment Methods'}
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer animate-fade-in"
              title={method.name}
            >
              {method.icon}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
          <Shield className="w-4 h-4" />
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