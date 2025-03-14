"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { ClaimFormData } from '../ClaimForm';

interface Step3Props {
  register: UseFormRegister<ClaimFormData>;
  errors: FieldErrors<ClaimFormData>;
  watch: UseFormWatch<ClaimFormData>;
  setValue: UseFormSetValue<ClaimFormData>;
  trigger: UseFormTrigger<ClaimFormData>;
  isRejected: boolean;
  rejectionReason: string;
}

export default function Step3Qualification({ 
  register, errors, watch, setValue, trigger, isRejected, rejectionReason 
}: Step3Props) {
  const filedComplaint = watch('filedComplaint');
  const hasPoliceReport = watch('hasPoliceReport');
  const receivedMedicalTreatment48Hours = watch('receivedMedicalTreatment48Hours');
  const receivedMedicalTreatment7Days = watch('receivedMedicalTreatment7Days');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Claim Qualification</h2>
        <p className="text-gray-600">
          Please provide additional information about your accident to help us process your claim.
        </p>
      </div>
      
      {isRejected ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="font-bold text-red-700 mb-2">We're Sorry</h3>
          <p className="text-red-700">{rejectionReason}</p>
          <p className="mt-4 text-gray-700">
            While your case may not meet our automated qualification criteria, there could be other 
            options available to you. Please call our team to discuss your situation in more detail.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="label block mb-2">Which rideshare company was involved?</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  id="rideshare-uber"
                  value="uber"
                  className="mr-2"
                  {...register('rideshareCompany')}
                />
                <label htmlFor="rideshare-uber" className="cursor-pointer">Uber</label>
              </div>
              <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  id="rideshare-lyft"
                  value="lyft"
                  className="mr-2"
                  {...register('rideshareCompany')}
                />
                <label htmlFor="rideshare-lyft" className="cursor-pointer">Lyft</label>
              </div>
            </div>
            {errors.rideshareCompany && (
              <p className="mt-1 text-sm text-red-600">{errors.rideshareCompany.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="accidentDate" className="label block mb-2">When did the accident occur?</label>
            <input
              type="date"
              id="accidentDate"
              className={`input ${errors.accidentDate ? 'border-red-500' : ''}`}
              {...register('accidentDate')}
            />
            {errors.accidentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.accidentDate.message}</p>
            )}
          </div>
          
          <div>
            <label className="label block mb-2">Have you filed a complaint with the rideshare company?</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="filed-yes"
                  className="mr-2"
                  {...register('filedComplaint')}
                  onClick={() => setValue('filedComplaint', true)}
                />
                <label htmlFor="filed-yes" className="cursor-pointer">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="filed-no"
                  className="mr-2"
                  {...register('filedComplaint')}
                  onClick={() => setValue('filedComplaint', false)}
                />
                <label htmlFor="filed-no" className="cursor-pointer">No</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="label block mb-2">Is there a police report for the accident?</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="police-yes"
                  className="mr-2"
                  {...register('hasPoliceReport')}
                  onClick={() => setValue('hasPoliceReport', true)}
                />
                <label htmlFor="police-yes" className="cursor-pointer">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="police-no"
                  className="mr-2"
                  {...register('hasPoliceReport')}
                  onClick={() => setValue('hasPoliceReport', false)}
                />
                <label htmlFor="police-no" className="cursor-pointer">No</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="label block mb-2">Did you receive medical treatment within 48 hours of the accident?</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="medical-48h-yes"
                  className="mr-2"
                  {...register('receivedMedicalTreatment48Hours')}
                  onClick={() => setValue('receivedMedicalTreatment48Hours', true)}
                />
                <label htmlFor="medical-48h-yes" className="cursor-pointer">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="medical-48h-no"
                  className="mr-2"
                  {...register('receivedMedicalTreatment48Hours')}
                  onClick={() => setValue('receivedMedicalTreatment48Hours', false)}
                />
                <label htmlFor="medical-48h-no" className="cursor-pointer">No</label>
              </div>
            </div>
          </div>
          
          {receivedMedicalTreatment48Hours === false && (
            <div>
              <label className="label block mb-2">Did you receive medical treatment within 7 days of the accident?</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="medical-7d-yes"
                    className="mr-2"
                    {...register('receivedMedicalTreatment7Days')}
                    onClick={() => setValue('receivedMedicalTreatment7Days', true)}
                  />
                  <label htmlFor="medical-7d-yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="medical-7d-no"
                    className="mr-2"
                    {...register('receivedMedicalTreatment7Days')}
                    onClick={() => setValue('receivedMedicalTreatment7Days', false)}
                  />
                  <label htmlFor="medical-7d-no" className="cursor-pointer">No</label>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
            <p>
              <strong>Important: </strong>
              To qualify for a rideshare accident claim, you typically need either a rideshare complaint 
              or police report, and must have received medical treatment within 7 days of the accident.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 