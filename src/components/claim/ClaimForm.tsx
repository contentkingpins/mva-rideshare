"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Involvement from './steps/Step2Involvement';
import Step3Qualification from './steps/Step3Qualification';
import Step4Processing from './steps/Step4Processing';
import Step5Final from './steps/Step5Final';

// Define the schema for all steps
const claimSchema = z.object({
  // Step 1: Basic contact information
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  phone: z.string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .transform(val => val.replace(/\D/g, '')) // Remove non-digit characters
    .refine(val => val.length >= 10 && val.length <= 15, {
      message: 'Phone number must be between 10 and 15 digits'
    }),
  email: z.string().email({ message: 'Valid email is required' }),
  
  // Step 2: Accident involvement
  role: z.enum(['passenger', 'guest', 'otherVehicle'], { 
    required_error: 'Please select your role in the accident'
  }),
  rideshareUserInfo: z.string().optional(),
  
  // Step 3: Legal qualification
  filedComplaint: z.boolean().optional()
    .transform(val => val === true), // Ensure it's a true boolean
  rideshareCompany: z.enum(['uber', 'lyft'], { 
    required_error: 'Please select the rideshare company'
  }),
  hasPoliceReport: z.boolean().optional()
    .transform(val => val === true), // Ensure it's a true boolean
  accidentDate: z.string().min(1, { message: 'Accident date is required' }),
  wasAmbulanceCalled: z.boolean().optional()
    .transform(val => val === true),
  receivedMedicalTreatment48Hours: z.boolean().optional()
    .transform(val => val === true),
  receivedMedicalTreatment7Days: z.boolean().optional()
    .transform(val => val === true),
});

export type ClaimFormData = z.infer<typeof claimSchema>;

export default function ClaimForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ClaimFormData>>({});
  const [isRejected, setIsRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const totalSteps = 5;

  // Detect if user is on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      // Check for small screen size
      const isMobileScreen = window.innerWidth < 768; // Use md breakpoint for better detection
      
      // Check for common mobile user agents
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Check for touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Set mobile view if any check passes
      const mobileDetected = isMobileScreen || isMobileUA || hasTouch;
      setIsMobileView(mobileDetected);
      
      // Debug output for mobile detection
      console.log('[MOBILE DEBUG] Mobile detection status:', {
        isMobileScreen,
        isMobileUA,
        hasTouch,
        mobileDetected
      });
      console.log('[MOBILE DEBUG] Window dimensions:', {
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Apply mobile-specific body class for CSS targeting
      if (mobileDetected) {
        document.body.classList.add('mobile-device');
        console.log('[MOBILE DEBUG] Added mobile-device class to body');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };
    
    // Check immediately
    checkIfMobile();
    
    // Use passive event listener for better performance on mobile
    window.addEventListener('resize', checkIfMobile, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      document.body.classList.remove('mobile-device');
    };
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    getValues,
    reset,
    trigger,
    watch,
    clearErrors,
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
    defaultValues: formData,
    mode: 'onChange'
  });

  // Watch for changes to key fields
  const role = watch('role');
  const filedComplaint = watch('filedComplaint');
  const hasPoliceReport = watch('hasPoliceReport');
  const receivedMedicalTreatment48Hours = watch('receivedMedicalTreatment48Hours');
  const receivedMedicalTreatment7Days = watch('receivedMedicalTreatment7Days');

  // Clear errors when switching steps
  useEffect(() => {
    // Reset form error when changing steps
    setFormError(null);
    
    if (currentStep === 2) {
      clearErrors('role');
    }
  }, [currentStep, clearErrors]);

  // Add debug console log to track rendering
  useEffect(() => {
    if (currentStep === 1) {
      console.log('[FORM DEBUG] Rendering Step 1 (Basic Info)', {
        currentStep,
        isValid,
        errors: Object.keys(errors).length > 0 ? errors : 'No errors',
        isMobileView
      });
    }
  }, [currentStep, errors, isValid, isMobileView]);

  // Load saved contact data from localStorage on initial render
  useEffect(() => {
    const savedContactData = localStorage.getItem('contactFormData');
    if (savedContactData) {
      try {
        const parsedData = JSON.parse(savedContactData) as Partial<ClaimFormData>;
        
        // Ensure we're setting all fields correctly
        if (parsedData) {
          // Set each field individually to ensure proper validation
          if (parsedData.firstName) setValue('firstName', parsedData.firstName);
          if (parsedData.lastName) setValue('lastName', parsedData.lastName);
          if (parsedData.phone) setValue('phone', parsedData.phone);
          if (parsedData.email) setValue('email', parsedData.email);
          
          setFormData(prev => ({ ...prev, ...parsedData }));
          
          // If we have complete contact data, skip to step 2
          if (parsedData.firstName && parsedData.lastName && 
              parsedData.phone && parsedData.email) {
            setCurrentStep(2);
          }
        }
      } catch (e) {
        console.error('Error parsing saved contact data:', e);
      }
    }
  }, [setValue]);

  // Validate current step fields
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await trigger(['firstName', 'lastName', 'phone', 'email']);
      case 2:
        // For step 2, validate both role and rideshareUserInfo if role is 'guest'
        if (role === 'guest') {
          const roleValid = await trigger('role');
          const userInfoValid = await trigger('rideshareUserInfo');
          return roleValid && userInfoValid;
        }
        return await trigger('role');
      case 3:
        // Update to include validation for new fields
        return await trigger(['rideshareCompany', 'accidentDate', 'wasAmbulanceCalled', 'receivedMedicalTreatment48Hours']);
      default:
        return true;
    }
  };

  // Handle step navigation
  const handleNextStep = async () => {
    // Get current form values
    const allValues = getValues();
    
    const isStepValid = await validateCurrentStep();
    
    if (!isStepValid) {
      setFormError("Please correct the errors before continuing.");
      return;
    }

    // Get current role value
    const currentRole = getValues('role');

    if (currentStep === 2 && !currentRole) {
      setFormError("Please select your role in the accident.");
      return;
    }

    if (currentStep === 2 && currentRole === 'guest') {
      const guestInfo = getValues('rideshareUserInfo');
      
      if (!guestInfo || guestInfo.trim() === '') {
        setFormError("Please provide information about the rideshare user.");
        return;
      }
    }

    // Special handling for step 3
    if (currentStep === 3) {
      const noComplaint = !filedComplaint;
      const noPoliceReport = !hasPoliceReport;
      
      if (noComplaint && noPoliceReport) {
        setIsRejected(true);
        setRejectionReason('To process a rideshare claim, there must be either a rideshare report or a police report.');
        return;
      }
      
      // Process the form (simulate API call)
      setIsLoading(true);
      
      // Simulate processing time
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(5);
      }, 5000);
      
      setCurrentStep(4);
      return;
    }

    // Save form data and move to next step
    const formValues = getValues();
    setFormData(prev => ({ ...prev, ...formValues }));
    
    // Actually advance the step
    setCurrentStep(prev => prev + 1);
  };

  // Add a direct form submission handler for step 1
  const submitStep1 = async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior if event is present
    if (e) {
      e.preventDefault();
    }
    
    try {
      // Get form values
      const formValues = getValues();
      
      // Validate required fields
      const isValid = await trigger(['firstName', 'lastName', 'phone', 'email']);
      
      if (!isValid) {
        setFormError("Please fill in all required fields correctly.");
        return;
      }
      
      // Save form data to localStorage for returning users
      try {
        const contactData = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phone: formValues.phone,
          email: formValues.email
        };
        localStorage.setItem('contactFormData', JSON.stringify(contactData));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        return newData;
      });
      
      // Force immediate step change for mobile
      setCurrentStep(2);
      
    } catch (error) {
      console.error('Error in submitStep1:', error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  // Add a direct form submission handler for step 2
  const submitStep2 = async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior if event is present
    if (e) {
      e.preventDefault();
    }
    
    try {
      // Get form values
      const formValues = getValues();
      
      // Make sure we have a role selected
      if (!formValues.role) {
        setFormError("Please select your role in the accident.");
        return;
      }
      
      // Special handling for guest role
      if (formValues.role === 'guest' && (!formValues.rideshareUserInfo || formValues.rideshareUserInfo.trim() === '')) {
        setFormError("Please provide information about the rideshare user.");
        return;
      }
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        return newData;
      });
      
      // Force immediate step change for mobile
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Error in submitStep2:', error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  // Add a direct form submission handler for step 3
  const submitStep3 = async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior if event is present
    if (e) {
      e.preventDefault();
    }
    
    try {
      // Get form values
      const formValues = getValues();
      
      // Make sure we have a rideshare company selected
      if (!formValues.rideshareCompany) {
        setFormError("Please select whether you were in an Uber or Lyft.");
        return;
      }
      
      // Check if accident date is provided
      if (!formValues.accidentDate) {
        setFormError("Please provide the date when the accident occurred.");
        return;
      }
      
      // Check if either complaint or police report is true
      const hasComplaint = formValues.filedComplaint === true;
      const hasReport = formValues.hasPoliceReport === true;
      
      if (!hasComplaint && !hasReport) {
        setIsRejected(true);
        setRejectionReason('To process a rideshare claim, there must be either a rideshare report or a police report.');
        return;
      }
      
      // Check for medical treatment
      const hadMedicalTreatment48Hours = formValues.receivedMedicalTreatment48Hours === true;
      const hadMedicalTreatment7Days = formValues.receivedMedicalTreatment7Days === true;
      
      // If they didn't receive treatment within 48 hours and we don't have info about 7 days
      if (!hadMedicalTreatment48Hours && formValues.receivedMedicalTreatment7Days === undefined) {
        setFormError("Please indicate if you received medical treatment within 7 days of the accident.");
        return;
      }
      
      // If neither medical treatment option is selected, reject the claim
      if (!hadMedicalTreatment48Hours && !hadMedicalTreatment7Days) {
        setIsRejected(true);
        setRejectionReason('To process a rideshare injury claim, you must have received medical treatment within 7 days of the accident.');
        return;
      }
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        return newData;
      });
      
      // Process the form (simulate API call)
      setIsLoading(true);
      
      // Force state update for processing step
      setCurrentStep(4);
      
      // Simulate processing time
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(5);
      }, 5000);
      
    } catch (error) {
      console.error('Error in submitStep3:', error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  // Handle the form submission
  const onSubmit = async (data: ClaimFormData) => {
    try {
      await handleNextStep();
    } catch (error) {
      console.error('Error in form submission:', error);
      setFormError("There was a problem submitting the form. Please try again.");
    }
  };

  // Go back to the previous step
  const goBack = () => {
    setCurrentStep(prevStep => Math.max(1, prevStep - 1));
    setFormError(null);
  };

  // Calculate progress percentage
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Start</span>
          <span>Processing</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`${
                index + 1 === currentStep
                  ? 'step-indicator-active'
                  : index + 1 < currentStep
                  ? 'bg-primary-600 text-white'
                  : 'step-indicator'
              } transition-colors duration-300`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div 
                className={`h-1 w-10 mx-1 ${
                  index + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form error message */}
      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="step1-container" style={{border: '2px dashed red', padding: '10px', marginBottom: '10px'}}>
                <h3 className="text-lg font-bold mb-2">DEBUG: Contact form should appear below</h3>
                <Step1BasicInfo 
                  register={register} 
                  errors={errors} 
                />
                
                {/* Emergency fallback contact form */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <h3 className="text-lg font-bold mb-4">Emergency Fallback Contact Form</h3>
                  <p className="text-sm text-gray-600 mb-4">If you cannot see the contact form above, please use this form instead:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label htmlFor="firstName-fallback" className="label">First Name</label>
                      <input
                        id="firstName-fallback"
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
                      <label htmlFor="lastName-fallback" className="label">Last Name</label>
                      <input
                        id="lastName-fallback"
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
                  
                  <div className="mb-4">
                    <label htmlFor="phone-fallback" className="label">Phone Number</label>
                    <input
                      id="phone-fallback"
                      type="tel"
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(555) 555-5555"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email-fallback" className="label">Email Address</label>
                    <input
                      id="email-fallback"
                      type="email"
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Involvement */}
            {currentStep === 2 && (
              <Step2Involvement 
                register={register} 
                errors={errors} 
                watch={watch}
                setValue={setValue}
                trigger={trigger}
              />
            )}

            {/* Step 3: Qualification */}
            {currentStep === 3 && (
              <Step3Qualification 
                register={register} 
                errors={errors} 
                watch={watch}
                setValue={setValue}
                trigger={trigger}
                isRejected={isRejected}
                rejectionReason={rejectionReason}
              />
            )}

            {/* Step 4: Processing */}
            {currentStep === 4 && (
              <Step4Processing 
                isLoading={isLoading}
              />
            )}

            {/* Step 5: Final CTA */}
            {currentStep === 5 && (
              <Step5Final />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentStep < 4 && !isRejected && (
          <div className="flex justify-between mt-8 gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="btn-outline px-5 py-3 sm:px-6 sm:py-3 text-base w-1/3 sm:w-auto touch-manipulation"
                disabled={isSubmitting}
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isSubmitting) {
                    submitStep1(e);
                  }
                }}
                className="btn-primary px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                disabled={isSubmitting}
                aria-label="Continue to next step"
              >
                Continue
              </button>
            ) : currentStep === 2 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isSubmitting) {
                    submitStep2(e);
                  }
                }}
                className="btn-primary px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                disabled={isSubmitting}
                aria-label="Continue to next step"
              >
                Continue
              </button>
            ) : currentStep === 3 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isSubmitting) {
                    submitStep3(e);
                  }
                }}
                className="btn-primary px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                disabled={isSubmitting}
                aria-label="Submit information"
              >
                Submit
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                disabled={isSubmitting}
                aria-label="Continue to next step"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            )}
          </div>
        )}

        {isRejected && (
          <div className="flex justify-center mt-8">
            <a
              href="tel:8885555555"
              className="btn-primary"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Please Click to Call a Case Manager Now
              </div>
            </a>
          </div>
        )}
      </form>
    </div>
  );
} 