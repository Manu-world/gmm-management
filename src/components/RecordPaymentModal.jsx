import React, { useState } from 'react';
import { Phone, CreditCard, Check, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";

const RecordPaymentModal = ({ user, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '50.00',
    phoneNumber: '',
    reference: '',
    paymentMethod: 'MTN Mobile Money'
  });
  const [errors, setErrors] = useState({});

  const validatePayment = (data) => {
    const errors = {};
    if (!data.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+233|0)(24|54|55|59)\d{7}$/.test(data.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Invalid MTN number format';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePayment(paymentData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call to MTN MoMo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(2);
      // Generate reference number
      const reference = 'MOM' + Date.now().toString().slice(-8);
      setPaymentData(prev => ({ ...prev, reference }));
    } catch (error) {
      setErrors({ submit: 'Payment processing failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment confirmation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
      // Wait before closing
      setTimeout(() => {
        onSuccess && onSuccess(paymentData);
        onClose();
      }, 2000);
    } catch (error) {
      setErrors({ confirm: 'Could not confirm payment. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            {step === 1 && "Process MTN Mobile Money payment"}
            {step === 2 && "Confirm payment details"}
            {step === 3 && "Payment successful!"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Amount (GH₵)
                </label>
                <input
                  type="text"
                  value={paymentData.amount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  MTN Mobile Money Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={paymentData.phoneNumber}
                    onChange={(e) => {
                      setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }));
                      if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }}
                    placeholder="+233 24 XXX XXXX"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Process Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="font-medium">GH₵ {paymentData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone Number:</span>
                  <span className="font-medium">{paymentData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Reference:</span>
                  <span className="font-medium">{paymentData.reference}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Please check your phone for the payment prompt and enter your MoMo PIN to complete the transaction.
                </p>
              </div>

              {errors.confirm && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.confirm}</AlertDescription>
                </Alert>
              )}

              <button
                onClick={confirmPayment}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Confirming...' : 'Confirm Payment'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payment Successful!</h3>
                <p className="text-sm text-gray-500">
                  Reference: {paymentData.reference}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentModal;