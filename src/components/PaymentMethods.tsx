import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

const PaymentMethods = () => {
  const { language } = useLanguage();

  const paymentMethods = [
    {
      name: "Visa",
      icon: (
        <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="26" rx="4" fill="#1A1F71"/>
          <path d="M15.342 19L17.456 7H20.188L18.074 19H15.342ZM13.16 7L10.756 15.932L10.498 14.6L9.766 9.448C9.652 8.854 9.148 7 7.72 7H2.092L2 7.24C3.622 7.576 5.1 8.122 6.322 8.836L8.326 19H11.146L15.16 7H13.16ZM31.036 19.228C30.334 19.228 29.632 18.976 29.632 18.976L30.028 16.936S30.766 17.188 31.252 17.188C31.738 17.188 32.08 16.936 32.08 16.504C32.08 16.072 31.738 15.892 31.018 15.496C30.298 15.1 29.632 14.236 29.632 13.228C29.632 11.464 31.036 10.24 33.172 10.24C34.018 10.24 34.72 10.456 34.72 10.456L34.36 12.424S33.802 12.244 33.28 12.244C32.758 12.244 32.44 12.46 32.44 12.82C32.44 13.18 32.806 13.36 33.478 13.72C34.15 14.08 34.936 14.872 34.936 16.036C34.936 17.8 33.532 19.228 31.036 19.228ZM26.248 7L24.364 15.694L24.088 14.2L23.356 9.448C23.242 8.854 22.738 7 21.31 7H15.682L15.59 7.24C17.212 7.576 18.69 8.122 19.912 8.836L21.916 19H24.736L28.75 7H26.248Z" fill="white"/>
        </svg>
      ),
    },
    {
      name: "Mastercard",
      icon: (
        <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="26" rx="4" fill="white" stroke="#E5E5E5"/>
          <circle cx="15" cy="13" r="8" fill="#EB001B"/>
          <circle cx="25" cy="13" r="8" fill="#F79E1B"/>
          <path d="M20 6.5C21.5 7.8 22.5 9.8 22.5 12C22.5 14.2 21.5 16.2 20 17.5C18.5 16.2 17.5 14.2 17.5 12C17.5 9.8 18.5 7.8 20 6.5Z" fill="#FF5F00"/>
        </svg>
      ),
    },
    {
      name: "Apple Pay",
      icon: (
        <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="26" rx="4" fill="black"/>
          <path d="M11.5 8.5C11.2 8.8 10.8 9.0 10.4 9.0C10.3 8.6 10.5 8.1 10.7 7.8C11.0 7.5 11.5 7.3 11.8 7.2C11.9 7.6 11.8 8.1 11.5 8.5ZM11.8 9.1C12.4 9.1 12.9 9.4 13.2 9.4C13.5 9.4 14.1 9.1 14.8 9.1C15.2 9.1 15.7 9.3 16.0 9.7C15.7 9.9 15.5 10.3 15.5 10.8C15.5 11.4 15.9 11.9 16.3 12.1C16.2 12.4 16.0 12.7 15.8 13.0C15.5 13.4 15.1 13.9 14.6 13.9C14.1 13.9 14.0 13.6 13.4 13.6C12.8 13.6 12.6 13.9 12.2 13.9C11.7 13.9 11.4 13.5 11.0 13.0C10.4 12.3 10.0 11.3 10.0 10.4C10.0 9.3 10.6 8.7 11.3 8.7C11.5 8.7 11.7 8.8 11.8 9.1Z" fill="white"/>
          <text x="18" y="16" fill="white" fontSize="8" fontFamily="Arial">Pay</text>
        </svg>
      ),
    },
    {
      name: "Google Pay",
      icon: (
        <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="26" rx="4" fill="white" stroke="#E5E5E5"/>
          <path d="M15.5 12.5H19.5V14H15.5V12.5Z" fill="#4285F4"/>
          <path d="M12 9.5C11.2 9.5 10.5 10.2 10.5 11V15C10.5 15.8 11.2 16.5 12 16.5H16V15H12V11H16V9.5H12Z" fill="#34A853"/>
          <path d="M19.5 9.5V16.5H21V15H23C23.8 15 24.5 14.3 24.5 13.5V11.5C24.5 10.7 23.8 10 23 10H21V9.5H19.5ZM21 11.5H23V13.5H21V11.5Z" fill="#FBBC05"/>
          <path d="M27.5 9.5C26.7 9.5 26 10.2 26 11V15C26 15.8 26.7 16.5 27.5 16.5H29.5C30.3 16.5 31 15.8 31 15V14H29.5V15H27.5V11H31V10C31 9.2 30.3 8.5 29.5 8.5H27.5V9.5Z" fill="#EA4335"/>
        </svg>
      ),
    },
    {
      name: "American Express",
      icon: (
        <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="26" rx="4" fill="#006FCF"/>
          <text x="4" y="16" fill="white" fontSize="6" fontFamily="Arial Bold">AMERICAN</text>
          <text x="6" y="22" fill="white" fontSize="6" fontFamily="Arial Bold">EXPRESS</text>
        </svg>
      ),
    },
    {
      name: "PayPal",
      icon: (
        <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="26" rx="4" fill="white" stroke="#E5E5E5"/>
          <path d="M12 8.5C13.1 8.5 14 9.4 14 10.5C14 11.6 13.1 12.5 12 12.5H10V8.5H12ZM16 8.5C17.1 8.5 18 9.4 18 10.5C18 11.6 17.1 12.5 16 12.5H14V8.5H16Z" fill="#253B80"/>
          <path d="M12 13.5C13.1 13.5 14 14.4 14 15.5C14 16.6 13.1 17.5 12 17.5H10V13.5H12ZM16 13.5C17.1 13.5 18 14.4 18 15.5C18 16.6 17.1 17.5 16 17.5H14V13.5H16Z" fill="#179BD7"/>
          <text x="20" y="16" fill="#253B80" fontSize="7" fontFamily="Arial">PayPal</text>
        </svg>
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