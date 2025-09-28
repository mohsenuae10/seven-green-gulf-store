import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { CreditCard, Smartphone } from "lucide-react";

const PaymentMethods = () => {
  const { language, t } = useLanguage();

  const paymentMethods = [
    {
      name: "Visa",
      icon: (
        <div className="w-8 h-5 bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded">
          VISA
        </div>
      ),
    },
    {
      name: "Mastercard",
      icon: (
        <div className="w-8 h-5 flex items-center justify-center rounded">
          <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full -ml-1 opacity-80"></div>
        </div>
      ),
    },
    {
      name: "Apple Pay",
      icon: (
        <div className="w-8 h-5 bg-black text-white text-xs font-bold flex items-center justify-center rounded">
          <Smartphone className="w-3 h-3" />
        </div>
      ),
    },
    {
      name: "Credit Card",
      icon: <CreditCard className="w-5 h-5 text-gray-600" />,
    },
  ];

  return (
    <Card className="p-4 bg-gray-50/50">
      <div className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {language === 'ar' ? 'طرق الدفع المقبولة' : 'Accepted Payment Methods'}
        </h3>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="flex items-center justify-center p-2 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              title={method.name}
            >
              {method.icon}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {language === 'ar' 
            ? 'جميع المعاملات آمنة ومشفرة' 
            : 'All transactions are secure and encrypted'
          }
        </p>
      </div>
    </Card>
  );
};

export default PaymentMethods;