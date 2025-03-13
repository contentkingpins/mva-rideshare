"use client";

import { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { ClaimFormData } from '../ClaimForm';

interface Step2Props {
  register: UseFormRegister<ClaimFormData>;
  errors: FieldErrors<ClaimFormData>;
  watch: UseFormWatch<ClaimFormData>;
  setValue?: UseFormSetValue<ClaimFormData>;
  trigger?: UseFormTrigger<ClaimFormData>;
}

export default function Step2Involvement({ register, errors, watch, setValue, trigger }: Step2Props) {
  const role = watch('role');
  const [localErrors, setLocalErrors] = useState<{[key: string]: string}>({});
  
  // Clear local validation errors when role changes
  useEffect(() => {
    setLocalErrors({});
  }, [role]);

  const validateRideshareUserInfo = (value: string | undefined) => {
    if (role === 'guest' && (!value || value.trim() === '')) {
      setLocalErrors(prev => ({
        ...prev,
        rideshareUserInfo: 'Please provide the rideshare user information'
      }));
      return false;
    }
    
    // Clear error if valid
    setLocalErrors(prev => {
      const newErrors = {...prev};
      delete newErrors.rideshareUserInfo;
      return newErrors;
    });
    
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Accident Involvement</h2>
        <p className="text-gray-600">
          Please tell us about your role in the rideshare accident.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          What was your role in the rideshare accident?
        </label>
        
        <div className="space-y-3">
          <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <input
              id="role-passenger"
              type="radio"
              value="passenger"
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              {...register('role', { required: 'Please select your role in the accident' })}
            />
            <label htmlFor="role-passenger" className="ml-3 cursor-pointer w-full">
              <div className="font-medium">I was a passenger in a rideshare vehicle</div>
              <p className="text-gray-500 text-sm">You were riding as a paying customer in an Uber or Lyft vehicle.</p>
            </label>
          </div>
          
          <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <input
              id="role-guest"
              type="radio"
              value="guest"
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              {...register('role', { required: 'Please select your role in the accident' })}
            />
            <label htmlFor="role-guest" className="ml-3 cursor-pointer w-full">
              <div className="font-medium">I was a guest traveling with a rideshare user</div>
              <p className="text-gray-500 text-sm">You were traveling with someone who ordered the rideshare service.</p>
            </label>
          </div>
          
          <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <input
              id="role-other-vehicle"
              type="radio"
              value="otherVehicle"
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              {...register('role', { required: 'Please select your role in the accident' })}
            />
            <label htmlFor="role-other-vehicle" className="ml-3 cursor-pointer w-full">
              <div className="font-medium">I was in another vehicle hit by a rideshare car</div>
              <p className="text-gray-500 text-sm">You were driving or riding in a separate vehicle that was involved in an accident with a rideshare vehicle.</p>
            </label>
          </div>
        </div>
        
        {(errors.role || localErrors.role) && (
          <p className="mt-2 text-sm text-red-600">{errors.role?.message || localErrors.role}</p>
        )}
      </div>

      {/* Additional information for guests */}
      {role === 'guest' && (
        <div className="mt-6 p-4 border border-primary-100 bg-primary-50 rounded-lg">
          <label htmlFor="rideshareUserInfo" className="block text-lg font-medium text-gray-700 mb-2">
            Please provide the rideshare user's information
          </label>
          <p className="text-gray-600 text-sm mb-3">
            We need the name and contact information of the person who ordered the rideshare.
          </p>
          <textarea
            id="rideshareUserInfo"
            className={`input min-h-[100px] ${(errors.rideshareUserInfo || localErrors.rideshareUserInfo) ? 'border-red-500' : ''}`}
            placeholder="e.g., John Doe, (555) 123-4567, john.doe@example.com"
            {...register('rideshareUserInfo', {
              validate: validateRideshareUserInfo
            })}
          />
          {(errors.rideshareUserInfo || localErrors.rideshareUserInfo) && (
            <p className="mt-1 text-sm text-red-600">{errors.rideshareUserInfo?.message || localErrors.rideshareUserInfo}</p>
          )}
        </div>
      )}

      <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 text-sm">
        <p className="flex">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Important: </strong>
            Your answer to this question will determine what information we need to process your claim.
          </span>
        </p>
      </div>
    </div>
  );
} 