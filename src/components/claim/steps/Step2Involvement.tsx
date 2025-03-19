"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { ClaimFormData } from '../ClaimForm';

interface Step2Props {
  register: UseFormRegister<ClaimFormData>;
  errors: FieldErrors<ClaimFormData>;
  watch: UseFormWatch<ClaimFormData>;
  setValue: UseFormSetValue<ClaimFormData>;
  trigger: UseFormTrigger<ClaimFormData>;
}

export default function Step2Involvement({ register, errors, watch, setValue, trigger }: Step2Props) {
  const role = watch('role');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Involvement</h2>
        <p className="text-gray-600">
          Please tell us about your role in the rideshare accident.
        </p>
      </div>

      <div className="space-y-4">
        <label className="label block">What was your role in the accident?</label>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              id="role-passenger"
              value="passenger"
              className="mt-1"
              {...register('role')}
            />
            <div>
              <label htmlFor="role-passenger" className="font-medium block cursor-pointer">
                I was a passenger in the rideshare vehicle
              </label>
              <p className="text-gray-600 text-sm">You were a paying customer in an Uber or Lyft when the accident occurred</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              id="role-guest"
              value="guest"
              className="mt-1"
              {...register('role')}
            />
            <div>
              <label htmlFor="role-guest" className="font-medium block cursor-pointer">
                I was with someone who ordered the rideshare
              </label>
              <p className="text-gray-600 text-sm">You were riding along with the person who ordered the Uber or Lyft</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              id="role-otherVehicle"
              value="otherVehicle"
              className="mt-1"
              {...register('role')}
            />
            <div>
              <label htmlFor="role-otherVehicle" className="font-medium block cursor-pointer">
                I was in another vehicle hit by a rideshare car
              </label>
              <p className="text-gray-600 text-sm">You were in your own vehicle or another car when hit by an Uber or Lyft</p>
            </div>
          </div>
        </div>
        
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>
      
      {role === 'guest' && (
        <div className="mt-6">
          <label htmlFor="rideshareUserInfo" className="label">
            Who ordered the rideshare?
          </label>
          <textarea
            id="rideshareUserInfo"
            className={`input min-h-24 w-full ${errors.rideshareUserInfo ? 'border-red-500' : ''}`}
            placeholder="Please provide the name of the person who ordered the rideshare and your relationship to them."
            {...register('rideshareUserInfo')}
          />
          {errors.rideshareUserInfo && (
            <p className="mt-1 text-sm text-red-600">{errors.rideshareUserInfo.message}</p>
          )}
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm mt-6">
        <p>
          <strong>Why this matters: </strong>
          Your role in the accident affects your legal rights and the type of compensation you may be eligible for.
        </p>
      </div>
    </div>
  );
} 