import React, { useState } from 'react';
import { Shield, Plane, FileCheck, ArrowRight, Users } from 'lucide-react';
import axios from 'axios';

interface WorkPermitModalProps {
  onComplete: () => void;
}

// Get the API URL from environment or default to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function WorkPermitModal({ onComplete }: WorkPermitModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token
      console.log('Getting token...');
      const tokenResponse = await axios.get(`${API_URL}/api/get-token`);
      const tokenData = tokenResponse.data;
      
      if (!tokenData.token) {
        throw new Error('Failed to get token');
      }

      console.log('Token received:', tokenData);

      // Submit order
      const orderData = {
        id: `visa_expert_${Date.now()}`,
        currency: 'KES',
        amount: 950,
        description: 'Work Permit Application Fee',
        callback_url: `${API_URL}/api/ipn`,
        notification_id: '',
        branch: 'Visa Expert',
        billing_address: {
          email_address: 'customer@example.com',
          phone_number: '0700000000',
          country_code: 'KE',
          first_name: 'Customer',
          middle_name: '',
          last_name: 'Name',
          line_1: 'Nairobi',
          line_2: '',
          city: 'Nairobi',
          state: '',
          postal_code: '',
          zip_code: '',
        },
      };

      console.log('Submitting order with data:', orderData);

      const submitResponse = await axios.post(`${API_URL}/api/submit-order`, {
        token: tokenData.token,
        orderData,
      });

      const submitData = submitResponse.data;
      console.log('Order submitted successfully:', submitData);

      if (submitData.redirect_url) {
        window.location.href = submitData.redirect_url;
      } else if (submitData.order_tracking_id) {
        window.location.href = `https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=${submitData.order_tracking_id}`;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[90vh] overflow-y-auto px-4 sm:px-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Process Work Permit</h2>
        <p className="text-gray-500 mt-2">Your gateway to working in Canada</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          To process your work permit and interview, a refundable fee of KSH950 will be required. This fee ensures fast-track processing of your application.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-green-500" />
          <span>After paying the fee you will receive:</span>
        </h3>
        <ul className="space-y-3">
          {[
            { icon: Shield, text: 'Canadian Work Permit', subtext: 'Valid for up to 3 years' },
            { icon: FileCheck, text: 'Certificate of Permanent Residency', subtext: 'Fast-track processing' },
            { icon: Plane, text: 'Sponsored Travel and Accommodation Visa', subtext: 'Full travel support' },
            { icon: Users, text: 'One-on-One Interview', subtext: 'Direct interview with company employers' }
          ].map((item, index) => (
            <li key={index} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <item.icon className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{item.text}</p>
                <p className="text-sm text-gray-500">{item.subtext}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{loading ? 'Processing...' : 'Complete Application'}</span>
        {!loading && <ArrowRight className="w-5 h-5" />}
      </button>

      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-gray-500">
        Join thousands of successful applicants already working in Canada
      </p>
    </div>
  );
}
