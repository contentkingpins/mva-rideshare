"use client";

import { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { ClaimFormData } from '../ClaimForm';

interface Step3Props {
  register: UseFormRegister<ClaimFormData>;
  errors: FieldErrors<ClaimFormData>;
  watch?: UseFormWatch<ClaimFormData>;
  setValue?: UseFormSetValue<ClaimFormData>;
  trigger?: UseFormTrigger<ClaimFormData>;
  isRejected: boolean;
  rejectionReason: string;
}

export default function Step3Qualification({ 
  register, 
  errors, 
  watch, 
  setValue, 
  trigger,
  isRejected, 
  rejectionReason 
}: Step3Props) {
  // Get the current values if watch is available
  const rideshareCompany = watch ? watch('rideshareCompany') : undefined;
  const filedComplaint = watch ? watch('filedComplaint') : undefined;
  const hasPoliceReport = watch ? watch('hasPoliceReport') : undefined;
  const accidentDate = watch ? watch('accidentDate') : undefined;
  const wasAmbulanceCalled = watch ? watch('wasAmbulanceCalled') : undefined;
  const receivedMedicalTreatment48Hours = watch ? watch('receivedMedicalTreatment48Hours') : undefined;
  const receivedMedicalTreatment7Days = watch ? watch('receivedMedicalTreatment7Days') : undefined;

  // Debug log for component initialization
  console.log('Step3Qualification rendered with values:', { 
    rideshareCompany, 
    filedComplaint, 
    hasPoliceReport,
    accidentDate,
    wasAmbulanceCalled,
    receivedMedicalTreatment48Hours,
    receivedMedicalTreatment7Days
  });

  // Log when the component mounts
  useEffect(() => {
    console.log('Step3Qualification component mounted');
    return () => {
      console.log('Step3Qualification component unmounted');
    };
  }, []);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setValue && trigger) {
      setValue('rideshareCompany', e.target.value as 'uber' | 'lyft');
      trigger('rideshareCompany');
    }
  };

  // Handle complaint radio buttons
  const handleComplaintChange = (value: boolean) => {
    if (setValue) {
      setValue('filedComplaint', value);
    }
  };

  // Handle police report radio buttons
  const handlePoliceReportChange = (value: boolean) => {
    if (setValue) {
      setValue('hasPoliceReport', value);
    }
  };

  // Handle ambulance radio buttons
  const handleAmbulanceChange = (value: boolean) => {
    if (setValue) {
      setValue('wasAmbulanceCalled', value);
    }
  };

  // Handle medical treatment within 48 hours radio buttons
  const handleMedicalTreatment48HoursChange = (value: boolean) => {
    if (setValue) {
      setValue('receivedMedicalTreatment48Hours', value);
      // If they selected "Yes" for 48 hours, we don't need to ask about 7 days
      if (value === true) {
        setValue('receivedMedicalTreatment7Days', false);
      }
    }
  };

  // Handle medical treatment within 7 days radio buttons
  const handleMedicalTreatment7DaysChange = (value: boolean) => {
    if (setValue) {
      setValue('receivedMedicalTreatment7Days', value);
    }
  };

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Legal & Insurance Qualification</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          This information helps us determine if your case meets the legal requirements for a successful claim.
        </p>
      </div>

      {isRejected ? (
        <div className="bg-red-50 p-5 sm:p-6 rounded-lg border border-red-100 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-red-800 mb-2">We Cannot Proceed With Your Claim</h3>
          <p className="text-gray-700 mb-4 px-1">
            {rejectionReason}
          </p>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
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
              className={`input py-3 px-4 text-base ${errors.rideshareCompany ? 'border-red-500' : ''}`}
              {...register('rideshareCompany', { required: 'Please select the rideshare company' })}
              onChange={handleCompanyChange}
              value={rideshareCompany}
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
            <label htmlFor="accidentDate" className="block text-lg font-medium text-gray-700">
              When did the accident occur?
            </label>
            <input
              type="date"
              id="accidentDate"
              className={`input py-3 px-4 text-base ${errors.accidentDate ? 'border-red-500' : ''}`}
              {...register('accidentDate', { required: 'Please provide the accident date' })}
            />
            {errors.accidentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.accidentDate.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Please select the date when the accident occurred.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Was an ambulance called to the scene?
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <input
                  id="ambulance-yes"
                  type="radio"
                  value="true"
                  checked={wasAmbulanceCalled === true}
                  onChange={() => handleAmbulanceChange(true)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="ambulance-yes" className="ml-2 text-base cursor-pointer" onClick={() => handleAmbulanceChange(true)}>Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  id="ambulance-no"
                  type="radio"
                  value="false"
                  checked={wasAmbulanceCalled === false}
                  onChange={() => handleAmbulanceChange(false)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="ambulance-no" className="ml-2 text-base cursor-pointer" onClick={() => handleAmbulanceChange(false)}>No</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Did you receive medical treatment within 48 hours of the accident?
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <input
                  id="medical-48hours-yes"
                  type="radio"
                  value="true"
                  checked={receivedMedicalTreatment48Hours === true}
                  onChange={() => handleMedicalTreatment48HoursChange(true)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="medical-48hours-yes" className="ml-2 text-base cursor-pointer" onClick={() => handleMedicalTreatment48HoursChange(true)}>Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  id="medical-48hours-no"
                  type="radio"
                  value="false"
                  checked={receivedMedicalTreatment48Hours === false}
                  onChange={() => handleMedicalTreatment48HoursChange(false)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="medical-48hours-no" className="ml-2 text-base cursor-pointer" onClick={() => handleMedicalTreatment48HoursChange(false)}>No</label>
              </div>
            </div>
          </div>

          {/* Conditionally show 7-day medical treatment question if they answered No to 48 hours */}
          {receivedMedicalTreatment48Hours === false && (
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700">
                Did you receive medical treatment within 7 days of the accident?
              </label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <input
                    id="medical-7days-yes"
                    type="radio"
                    value="true"
                    checked={receivedMedicalTreatment7Days === true}
                    onChange={() => handleMedicalTreatment7DaysChange(true)}
                    className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="medical-7days-yes" className="ml-2 text-base cursor-pointer" onClick={() => handleMedicalTreatment7DaysChange(true)}>Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="medical-7days-no"
                    type="radio"
                    value="false"
                    checked={receivedMedicalTreatment7Days === false}
                    onChange={() => handleMedicalTreatment7DaysChange(false)}
                    className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="medical-7days-no" className="ml-2 text-base cursor-pointer" onClick={() => handleMedicalTreatment7DaysChange(false)}>No</label>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Did you file a complaint with the rideshare app?
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <input
                  id="complaint-yes"
                  type="radio"
                  value="true"
                  checked={filedComplaint === true}
                  onChange={() => handleComplaintChange(true)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="complaint-yes" className="ml-2 text-base cursor-pointer" onClick={() => handleComplaintChange(true)}>Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  id="complaint-no"
                  type="radio"
                  value="false"
                  checked={filedComplaint === false}
                  onChange={() => handleComplaintChange(false)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="complaint-no" className="ml-2 text-base cursor-pointer" onClick={() => handleComplaintChange(false)}>No</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Is there a police report?
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <input
                  id="police-report-yes"
                  type="radio"
                  value="true"
                  checked={hasPoliceReport === true}
                  onChange={() => handlePoliceReportChange(true)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="police-report-yes" className="ml-2 text-base cursor-pointer" onClick={() => handlePoliceReportChange(true)}>Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  id="police-report-no"
                  type="radio"
                  value="false"
                  checked={hasPoliceReport === false}
                  onChange={() => handlePoliceReportChange(false)}
                  className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="police-report-no" className="ml-2 text-base cursor-pointer" onClick={() => handlePoliceReportChange(false)}>No</label>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 sm:p-5 rounded-md text-blue-800 text-sm">
            <p className="flex flex-col sm:flex-row sm:items-start">
              <svg className="w-5 h-5 mr-0 mb-2 sm:mb-0 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                <strong>Note: </strong>
                Medical treatment following an accident significantly improves your case. Documentation of treatment will be requested during your claim.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 