"use client";

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ClaimFormData } from '../ClaimForm';

interface Step1Props {
  register: UseFormRegister<ClaimFormData>;
  errors: FieldErrors<ClaimFormData>;
}

export default function Step1BasicInfo({ register, errors }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Please provide your basic contact information so we can reach you about your claim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="label">First Name</label>
          <input
            id="firstName"
            type="text"
            className={`input ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder="John"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="label">Last Name</label>
          <input
            id="lastName"
            type="text"
            className={`input ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder="Doe"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="phone" className="label">Phone Number</label>
        <input
          id="phone"
          type="tel"
          className={`input ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="(555) 555-5555"
          {...register('phone', {
            required: 'Phone number is required',
            setValueAs: (value) => value.replace(/\D/g, '') // Strip non-digits on submission
          })}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Include area code, e.g., 5551234567 or (555) 123-4567</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
        <p>
          <strong>Your Privacy is Important: </strong>
          We'll only use your contact information to assist with your claim and will never share it with third parties without your consent.
        </p>
      </div>
    </div>
  );
} 