import React, { useState } from 'react';
import { Calendar, CheckCircle, Loader2, Clock, CalendarCheck, FileCheck, Users, Building2 } from 'lucide-react';

interface UpcomingInterviewModalProps {
  onClose: () => void;
}

export function UpcomingInterviewModal({ onClose }: UpcomingInterviewModalProps) {
  const [step, setStep] = useState<'confirm' | 'date' | 'payment' | 'success'>('confirm');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleConfirmApplication = () => {
    setStep('date');
  };

  const handleDateConfirm = () => {
    setStep('payment');
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto px-3 sm:px-6">
      {/* Progress Steps */}
      <div className="relative pt-4">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-600 rounded transition-all duration-500 ease-in-out"
            style={{ 
              width: 
                step === 'confirm' ? '25%' : 
                step === 'date' ? '50%' :
                step === 'payment' ? '75%' : '100%' 
            }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <div className={`flex flex-col items-center ${step === 'confirm' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs mt-1">Confirm</span>
          </div>
          <div className={`flex flex-col items-center ${step === 'date' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Calendar className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs mt-1">Date</span>
          </div>
          <div className={`flex flex-col items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
            <FileCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs mt-1">Payment</span>
          </div>
          <div className={`flex flex-col items-center ${step === 'success' ? 'text-blue-600' : 'text-gray-500'}`}>
            <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs mt-1">Complete</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all hover:scale-105">
          <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upcoming Interview</h2>
        <p className="text-base sm:text-lg text-gray-600">Schedule your interview with company supervisors</p>
      </div>

      {step === 'confirm' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-4">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Company Interview Details</h3>
                <p className="text-gray-600 mt-1">
                  Confirm your application to proceed with scheduling your interview with our Canadian company supervisors.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 flex items-center space-x-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span className="text-gray-700">Direct Supervisor Interview</span>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 flex items-center space-x-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span className="text-gray-700">Flexible Scheduling</span>
            </div>
          </div>

          <button
            onClick={handleConfirmApplication}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 sm:py-6 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-3 font-semibold"
          >
            <span>Confirm Application</span>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
      )}

      {step === 'date' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 sm:p-8 rounded-xl border border-green-100">
            <div className="flex items-start space-x-4">
              <CalendarCheck className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Select Preferred Date</h3>
                <p className="text-gray-600 mt-1">
                  Choose your preferred interview date. Our team will confirm the exact time based on supervisor availability.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            onClick={handleDateConfirm}
            disabled={!selectedDate}
            className={`w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 sm:py-6 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-3 font-semibold ${
              !selectedDate ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-700 hover:to-blue-700'
            }`}
          >
            <span>Confirm Date</span>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 sm:p-8 rounded-xl border border-yellow-100">
            <div className="flex items-start space-x-4">
              <FileCheck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Verification</h3>
                <p className="text-gray-600 mt-1">
                  Please paste your payment transaction message below to verify your payment and confirm your interview slot.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <textarea
              value={paymentMessage}
              onChange={(e) => setPaymentMessage(e.target.value)}
              placeholder="Paste your payment transaction message here..."
              className="w-full h-32 sm:h-40 p-4 sm:p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmitPayment}
            disabled={!paymentMessage.trim() || isSubmitting}
            className={`w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 sm:py-6 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-3 font-semibold ${
              !paymentMessage.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-700 hover:to-orange-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
                <span>Verifying Payment...</span>
              </>
            ) : (
              <>
                <span>Submit Payment Details</span>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              </>
            )}
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 sm:p-12 rounded-xl border border-green-100 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4">
              Interview Scheduling in Progress
            </h3>
            <p className="text-green-700 text-lg sm:text-xl leading-relaxed">
              Thank you for submitting your payment details. Our team will verify your payment within 24 hours and schedule your interview based on your preferred date.
            </p>
            <p className="text-green-600 mt-4 font-medium">
              You will receive an email with the confirmed interview time and further instructions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-4 sm:py-6 px-6 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3 font-medium"
          >
            <span>Close</span>
          </button>
        </div>
      )}
    </div>
  );
}
