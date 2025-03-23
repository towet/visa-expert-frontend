import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ImmigrationCodeModalProps {
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export function ImmigrationCodeModal({ onClose, onSubmit }: ImmigrationCodeModalProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg w-full bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome to Canada Visa Expert</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors p-2"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Please enter your visa immigration code to continue
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your code"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Access Your Immigration Portal
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        Need assistance? Contact your immigration advisor
      </div>
    </div>
  );
}
