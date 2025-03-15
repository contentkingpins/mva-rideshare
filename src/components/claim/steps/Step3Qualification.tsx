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

  // Handle checkbox change
  const handleCheckboxChange = (field: string) => {
    console.log(`Toggling ${field}`);
    const currentValue = watch(field as any);
    setValue(field as any, !currentValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Claim Qualification</h2>
        <p className="text-gray-600">
          Please answer each question below about your accident to help us process your claim.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You can select multiple options that apply to your situation.
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
            <h3 className="font-semibold text-lg mb-4">Please check all that apply to your situation:</h3>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filed-complaint"
                  className="mr-2 h-5 w-5"
                  checked={filedComplaint === true}
                  onChange={() => handleCheckboxChange('filedComplaint')}
                />
                <label 
                  htmlFor="filed-complaint" 
                  className="cursor-pointer"
                >
                  I have filed a complaint with the rideshare company
                </label>
              </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="police-report"
                  className="mr-2 h-5 w-5"
                  checked={hasPoliceReport === true}
                  onChange={() => handleCheckboxChange('hasPoliceReport')}
                />
                <label 
                  htmlFor="police-report" 
                  className="cursor-pointer"
                >
                  There is a police report for the accident
                </label>
              </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ambulance-called"
                  className="mr-2 h-5 w-5"
                  checked={wasAmbulanceCalled === true}
                  onChange={() => handleCheckboxChange('wasAmbulanceCalled')}
                />
                <label 
                  htmlFor="ambulance-called" 
                  className="cursor-pointer"
                >
                  An ambulance was called to the accident scene
                </label>
              </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="medical-48h"
                  className="mr-2 h-5 w-5"
                  checked={receivedMedicalTreatment48Hours === true}
                  onChange={() => handleCheckboxChange('receivedMedicalTreatment48Hours')}
                />
                <label 
                  htmlFor="medical-48h" 
                  className="cursor-pointer"
                >
                  I received medical treatment within 48 hours of the accident
                </label>
              </div>
            </div>
          
            {!receivedMedicalTreatment48Hours && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="medical-7d"
                    className="mr-2 h-5 w-5"
                    checked={receivedMedicalTreatment7Days === true}
                    onChange={() => handleCheckboxChange('receivedMedicalTreatment7Days')}
                  />
                  <label 
                    htmlFor="medical-7d" 
                    className="cursor-pointer"
                  >
                    I received medical treatment within 7 days of the accident
                  </label>
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