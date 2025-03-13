"use client";

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ClaimFormData } from '../ClaimForm';

interface Step3Props {
  register: UseFormRegister<ClaimFormData>;
  errors: FieldErrors<ClaimFormData>;
  isRejected: boolean;
  rejectionReason: string;
}

export default function Step3Qualification({ register, errors, isRejected, rejectionReason }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Legal & Insurance Qualification</h2>
        <p className="text-gray-600">
          This information helps us determine if your case meets the legal requirements for a successful claim.
        </p>
      </div>

      {isRejected ? (
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-red-800 mb-2">We Cannot Proceed With Your Claim</h3>
          <p className="text-gray-700 mb-4">
            {rejectionReason}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            For a rideshare claim to be processed, we need either a report filed with the rideshare company or a police report.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <label htmlFor="rideshareCompany" className="block text-lg font-medium text-gray-700">
              Were you in an Uber or Lyft?
            </label>
            <select
              id="rideshareCompany"
              className={`input ${errors.rideshareCompany ? 'border-red-500' : ''}`}
              {...register('rideshareCompany')}
            >
              <option value="">Please select...</option>
              <option value="uber">Uber</option>
              <option value="lyft">Lyft</option>
            </select>
            {errors.rideshareCompany && (
              <p className="mt-1 text-sm text-red-600">{errors.rideshareCompany.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Did you file a complaint with the rideshare app?
            </label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  id="complaint-yes"
                  type="radio"
                  value="true"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  {...register('filedComplaint')}
                />
                <label htmlFor="complaint-yes" className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  id="complaint-no"
                  type="radio"
                  value="false"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  {...register('filedComplaint')}
                />
                <label htmlFor="complaint-no" className="ml-2">No</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Is there a police report?
            </label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  id="police-report-yes"
                  type="radio"
                  value="true"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  {...register('hasPoliceReport')}
                />
                <label htmlFor="police-report-yes" className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  id="police-report-no"
                  type="radio"
                  value="false"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  {...register('hasPoliceReport')}
                />
                <label htmlFor="police-report-no" className="ml-2">No</label>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
            <p className="flex">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                <strong>Note: </strong>
                A police report or rideshare complaint significantly improves your chances of a successful claim.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 