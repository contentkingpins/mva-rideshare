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

  // Add some effects to handle radio button state correctly
  const handleRadioChange = (field: string, value: boolean) => {
    console.log(`Setting ${field} to ${value}`);
    setValue(field as any, value);
  };

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
                  value="true"
                  className="mr-2"
                  checked={filedComplaint === true}
                  {...register('filedComplaint')}
                  onChange={() => handleRadioChange('filedComplaint', true)}
                />
                <label 
                  htmlFor="filed-yes" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('filedComplaint', true)}
                >Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="filed-no"
                  value="false"
                  className="mr-2"
                  checked={filedComplaint === false}
                  {...register('filedComplaint')}
                  onChange={() => handleRadioChange('filedComplaint', false)}
                />
                <label 
                  htmlFor="filed-no" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('filedComplaint', false)}
                >No</label>
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
                  value="true"
                  className="mr-2"
                  checked={hasPoliceReport === true}
                  {...register('hasPoliceReport')}
                  onChange={() => handleRadioChange('hasPoliceReport', true)}
                />
                <label 
                  htmlFor="police-yes" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('hasPoliceReport', true)}
                >Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="police-no"
                  value="false"
                  className="mr-2"
                  checked={hasPoliceReport === false}
                  {...register('hasPoliceReport')}
                  onChange={() => handleRadioChange('hasPoliceReport', false)}
                />
                <label 
                  htmlFor="police-no" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('hasPoliceReport', false)}
                >No</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="label block mb-2">Was an ambulance called to the accident scene?</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="ambulance-yes"
                  value="true"
                  className="mr-2"
                  checked={wasAmbulanceCalled === true}
                  {...register('wasAmbulanceCalled')}
                  onChange={() => handleRadioChange('wasAmbulanceCalled', true)}
                />
                <label 
                  htmlFor="ambulance-yes" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('wasAmbulanceCalled', true)}
                >Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="ambulance-no"
                  value="false"
                  className="mr-2"
                  checked={wasAmbulanceCalled === false}
                  {...register('wasAmbulanceCalled')}
                  onChange={() => handleRadioChange('wasAmbulanceCalled', false)}
                />
                <label 
                  htmlFor="ambulance-no" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('wasAmbulanceCalled', false)}
                >No</label>
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
                  value="true"
                  className="mr-2"
                  checked={receivedMedicalTreatment48Hours === true}
                  {...register('receivedMedicalTreatment48Hours')}
                  onChange={() => handleRadioChange('receivedMedicalTreatment48Hours', true)}
                />
                <label 
                  htmlFor="medical-48h-yes" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('receivedMedicalTreatment48Hours', true)}
                >Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="medical-48h-no"
                  value="false"
                  className="mr-2"
                  checked={receivedMedicalTreatment48Hours === false}
                  {...register('receivedMedicalTreatment48Hours')}
                  onChange={() => handleRadioChange('receivedMedicalTreatment48Hours', false)}
                />
                <label 
                  htmlFor="medical-48h-no" 
                  className="cursor-pointer"
                  onClick={() => handleRadioChange('receivedMedicalTreatment48Hours', false)}
                >No</label>
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
                    value="true"
                    className="mr-2"
                    checked={receivedMedicalTreatment7Days === true}
                    {...register('receivedMedicalTreatment7Days')}
                    onChange={() => handleRadioChange('receivedMedicalTreatment7Days', true)}
                  />
                  <label 
                    htmlFor="medical-7d-yes" 
                    className="cursor-pointer"
                    onClick={() => handleRadioChange('receivedMedicalTreatment7Days', true)}
                  >Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="medical-7d-no"
                    value="false"
                    className="mr-2"
                    checked={receivedMedicalTreatment7Days === false}
                    {...register('receivedMedicalTreatment7Days')}
                    onChange={() => handleRadioChange('receivedMedicalTreatment7Days', false)}
                  />
                  <label 
                    htmlFor="medical-7d-no" 
                    className="cursor-pointer"
                    onClick={() => handleRadioChange('receivedMedicalTreatment7Days', false)}
                  >No</label>
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