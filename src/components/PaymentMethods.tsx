import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

const PaymentMethods = () => {
  const { language } = useLanguage();

  const paymentMethods = [
    {
      name: "Visa",
      icon: (
        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold flex items-center justify-center rounded shadow-sm">
          VISA
        </div>
      ),
    },
    {
      name: "Mastercard",
      icon: (
        <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center rounded shadow-sm relative">
          <div className="absolute left-2">
            <div className="w-4 h-4 bg-red-500 rounded-full opacity-90"></div>
          </div>
          <div className="absolute right-2">
            <div className="w-4 h-4 bg-orange-400 rounded-full opacity-90"></div>
          </div>
        </div>
      ),
    },
    {
      name: "Apple Pay",
      icon: (
        <div className="w-12 h-8 bg-black text-white text-xs font-semibold flex items-center justify-center rounded shadow-sm">
          <span className="mr-1">🍎</span>Pay
        </div>
      ),
    },
    {
      name: "Google Pay",
      icon: (
        <div className="w-12 h-8 bg-white border border-gray-200 text-xs font-semibold flex items-center justify-center rounded shadow-sm">
          <span className="text-blue-500">G</span>
          <span className="text-red-500 ml-0.5">Pay</span>
        </div>
      ),
    },
    {
      name: "American Express",
      icon: (
        <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-bold flex items-center justify-center rounded shadow-sm">
          AMEX
        </div>
      ),
    },
    {
      name: "PayPal",
      icon: (
        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold flex items-center justify-center rounded shadow-sm">
          PayPal
        </div>
      ),
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
              className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
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