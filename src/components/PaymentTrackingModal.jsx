import {  Plus, CreditCard } from 'lucide-react';
import { useState } from 'react';




const PaymentTrackingModal = ({ user, onClose }) => {
    const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
    
    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Payment History</h3>
          <p className="text-sm text-gray-500">Member since {user.memberSince}</p>
        </div>
        <button
          onClick={() => setShowRecordPaymentModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      <div className="space-y-4">
        {user.payments.map(payment => (
          <div key={payment.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">₵{payment.amount}</p>
                <p className="text-sm text-gray-500">{payment.date}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {payment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
    )};

  export default PaymentTrackingModal;