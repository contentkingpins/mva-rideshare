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
  const wasAmbulanceCalled = watch('wasAmbulanceCalled');
  const receivedMedicalTreatment48Hours = watch('receivedMedicalTreatment48Hours');
  const receivedMedicalTreatment7Days = watch('receivedMedicalTreatment7Days');

  // Add debugging to help troubleshoot form values
  console.log("Step3 form values:", { 
    filedComplaint, 
    hasPoliceReport,
    wasAmbulanceCalled,
    receivedMedicalTreatment48Hours, 
    receivedMedicalTreatment7Days 
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Claim Qualification</h2>
        <p className="text-gray-600">
          Please answer each question below about your accident to help us process your claim.
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
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-4">Please answer each question about your accident:</h3>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="mb-2 font-medium">Have you filed a complaint with the rideshare company?</p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="filed-complaint-yes"
                    value="true"
                    className="mr-2"
                    {...register('filedComplaint')}
                  />
                  <label htmlFor="filed-complaint-yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="filed-complaint-no"
                    value="false"
                    className="mr-2"
                    {...register('filedComplaint')}
                  />
                  <label htmlFor="filed-complaint-no" className="cursor-pointer">No</label>
                </div>
              </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="mb-2 font-medium">Is there a police report for the accident?</p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="police-report-yes"
                    value="true"
                    className="mr-2"
                    {...register('hasPoliceReport')}
                  />
                  <label htmlFor="police-report-yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="police-report-no"
                    value="false"
                    className="mr-2"
                    {...register('hasPoliceReport')}
                  />
                  <label htmlFor="police-report-no" className="cursor-pointer">No</label>
                </div>
              </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="mb-2 font-medium">Was an ambulance called to the accident scene?</p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="ambulance-called-yes"
                    value="true"
                    className="mr-2"
                    {...register('wasAmbulanceCalled')}
                  />
                  <label htmlFor="ambulance-called-yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="ambulance-called-no"
                    value="false"
                    className="mr-2"
                    {...register('wasAmbulanceCalled')}
                  />
                  <label htmlFor="ambulance-called-no" className="cursor-pointer">No</label>
                </div>
              </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="mb-2 font-medium">Did you receive medical treatment within 48 hours of the accident?</p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="medical-48h-yes"
                    value="true"
                    className="mr-2"
                    {...register('receivedMedicalTreatment48Hours')}
                  />
                  <label htmlFor="medical-48h-yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="medical-48h-no"
                    value="false"
                    className="mr-2"
                    {...register('receivedMedicalTreatment48Hours')}
                  />
                  <label htmlFor="medical-48h-no" className="cursor-pointer">No</label>
                </div>
              </div>
            </div>
          
            {receivedMedicalTreatment48Hours === false && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="mb-2 font-medium">Did you receive medical treatment within 7 days of the accident?</p>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="medical-7d-yes"
                      value="true"
                      className="mr-2"
                      {...register('receivedMedicalTreatment7Days')}
                    />
                    <label htmlFor="medical-7d-yes" className="cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="medical-7d-no"
                      value="false"
                      className="mr-2"
                      {...register('receivedMedicalTreatment7Days')}
                    />
                    <label htmlFor="medical-7d-no" className="cursor-pointer">No</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
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