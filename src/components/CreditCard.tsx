"use client"

import React from 'react';
import { Wifi } from 'lucide-react';

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
}

export function CreditCard({ cardNumber, cardHolder, cardExpiry }: CreditCardProps) {
  const formatCardNumber = (num: string) => {
    const parts = num.padEnd(16, '•').match(/.{1,4}/g);
    return parts ? parts.join(' ') : '';
  };

  const formatExpiry = (expiry: string) => {
    if (!expiry) return 'MM/YY';
    const [month, year] = expiry.split('/');
    return `${month || 'MM'}/${year || 'YY'}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto aspect-[1.586] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl p-6 flex flex-col justify-between font-mono">
      <div className="flex justify-between items-start">
        <div className="w-12 h-8 bg-yellow-500 rounded-md" />
        <Wifi size={32} className="-rotate-90" />
      </div>
      <div className="mt-4">
        <p className="text-2xl md:text-3xl tracking-widest">{formatCardNumber(cardNumber)}</p>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div>
          <p className="text-xs text-gray-400 uppercase">Card Holder</p>
          <p className="text-lg tracking-wide uppercase">{cardHolder || 'FULL NAME'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Expires</p>
          <p className="text-lg tracking-wide">{formatExpiry(cardExpiry)}</p>
        </div>
      </div>
    </div>
  );
}