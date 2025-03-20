"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent, trackCustomEvent, events } from '@/utils/metaPixel';

// Import all steps directly, no relative imports that might cause issues
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Involvement from './steps/Step2Involvement';
import Step3Qualification from './steps/Step3Qualification';
import Step4Processing from './steps/Step4Processing';
import Step5Final from './steps/Step5Final';
import Script from 'next/script';

// Define the schema for all steps
const claimSchema = z.object({
  // Step 1: Basic contact information
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid email is required' }).optional(),
  phone: z.string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .transform(val => val.replace(/\D/g, '')) // Remove non-digit characters
    .refine(val => val.length >= 10 && val.length <= 15, {
      message: 'Phone number must be between 10 and 15 digits'
    }),
  
  // Step 2: Accident involvement
  role: z.enum(['passenger', 'guest', 'otherVehicle'], { 
    required_error: 'Please select your role in the accident'
  }),
  rideshareUserInfo: z.string().optional(),
  
  // Step 3: Legal qualification
  filedComplaint: z.union([z.boolean(), z.string()]).optional()
    .transform(val => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      if (val === 'false') return false;
      return false;
    }),
  rideshareCompany: z.enum(['uber', 'lyft'], { 
    required_error: 'Please select the rideshare company'
  }),
  hasPoliceReport: z.union([z.boolean(), z.string()]).optional()
    .transform(val => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      if (val === 'false') return false;
      return false;
    }),
  accidentDate: z.string().min(1, { message: 'Accident date is required' }),
  wasAmbulanceCalled: z.union([z.boolean(), z.string()]).optional()
    .transform(val => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      if (val === 'false') return false;
      return false;
    }),
  receivedMedicalTreatment48Hours: z.union([z.boolean(), z.string()]).optional()
    .transform(val => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      if (val === 'false') return false;
      return false;
    }),
  receivedMedicalTreatment7Days: z.union([z.boolean(), z.string()]).optional()
    .transform(val => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      if (val === 'false') return false;
      return false;
    }),
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
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
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
      
      // Apply mobile-specific body class for CSS targeting
      if (mobileDetected) {
        document.body.classList.add('mobile-device');
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
  const wasAmbulanceCalled = watch('wasAmbulanceCalled');
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
          
          setFormData(prev => ({ ...prev, ...parsedData }));
          
          // If we have complete contact data, skip to step 2
          // Only skip if ALL required contact fields are present and non-empty
          if (parsedData.firstName && parsedData.firstName.trim() !== '' &&
              parsedData.lastName && parsedData.lastName.trim() !== '' &&
              parsedData.phone && parsedData.phone.trim() !== '') {
            // For mobile view, make sure we still start at step 1 to allow users to confirm data
            if (!isMobileView) {
              setCurrentStep(2);
            } else {
              // For mobile, always start at step 1 to allow users to verify their info
              setCurrentStep(1);
            }
          } else {
            // If data is incomplete, always start at step 1
            setCurrentStep(1);
          }
        }
      } catch (e) {
        console.error('Error parsing saved contact data:', e);
      }
    }
  }, [setValue, isMobileView]);

  // Validate current step fields
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await trigger(['firstName', 'lastName', 'phone']);
      case 2:
        // For step 2, validate both role and rideshareUserInfo if role is 'guest'
        if (role === 'guest') {
          const roleValid = await trigger('role');
          const userInfoValid = await trigger('rideshareUserInfo');
          return roleValid && userInfoValid;
        }
        return await trigger('role');
      case 3:
        // Only validate the required fields: rideshare company and accident date
        // The checkboxes are optional and will be validated in the submitStep3 function
        return await trigger(['rideshareCompany', 'accidentDate']);
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

  // Form submission handlers for each step
  
  // Submit step 1 (basic info)
  const submitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = await validateCurrentStep();
      
      if (!isValid) {
        return;
      }
      
      // Track step 1 completion
      trackCustomEvent(events.COMPLETE_CLAIM_STEP, {
        step: 1,
        step_name: 'Basic Info'
      });
      
      setCurrentStep(2);
    } catch (error) {
      console.error('Error in submitStep1:', error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };
  
  // Submit step 2 (involvement)
  const submitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = await validateCurrentStep();
      
      if (!isValid) {
        return;
      }
      
      // Track step 2 completion
      trackCustomEvent(events.COMPLETE_CLAIM_STEP, {
        step: 2,
        step_name: 'Involvement'
      });
      
      setCurrentStep(3);
    } catch (error) {
      console.error('Error in submitStep2:', error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };
  
  // Submit step 3 (qualification)
  const submitStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      const isValid = await trigger(['rideshareCompany', 'accidentDate']);
      
      if (!isValid) {
        return;
      }
      
      // Get current form values
      const formValues = getValues();
      
      // Check for complaint or police report
      const hasComplaint = Boolean(formValues.filedComplaint);
      const hasReport = Boolean(formValues.hasPoliceReport);
      
      if (!hasComplaint && !hasReport) {
        setIsRejected(true);
        setRejectionReason('To process a rideshare claim, there must be either a rideshare report or a police report.');
        
        // Track rejection with both client and server-side tracking
        const { trackEventWithRedundancy } = await import('@/utils/metaConversionsApi');
        trackEventWithRedundancy(
          'ClaimRejected', 
          {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phone: formValues.phone,
          },
          {
            reason: 'No complaint or police report',
            step: 3
          }
        );
        
        return;
      }
      
      // Check for medical treatment
      const hadMedicalTreatment48Hours = Boolean(formValues.receivedMedicalTreatment48Hours);
      const hadMedicalTreatment7Days = Boolean(formValues.receivedMedicalTreatment7Days);
      
      // If neither medical treatment option is selected, reject the claim
      if (!hadMedicalTreatment48Hours && !hadMedicalTreatment7Days) {
        setIsRejected(true);
        setRejectionReason('To process a rideshare injury claim, you must have received medical treatment within 7 days of the accident.');
        
        // Track rejection with both client and server-side tracking
        const { trackEventWithRedundancy } = await import('@/utils/metaConversionsApi');
        trackEventWithRedundancy(
          'ClaimRejected', 
          {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phone: formValues.phone,
          },
          {
            reason: 'No medical treatment within 7 days',
            step: 3
          }
        );
        
        return;
      }
      
      // Track step 3 completion with both client and server-side tracking
      const { trackEventWithRedundancy } = await import('@/utils/metaConversionsApi');
      trackEventWithRedundancy(
        events.COMPLETE_CLAIM_STEP, 
        {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phone: formValues.phone,
        },
        {
          step: 3,
          step_name: 'Qualification'
        }
      );
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        return newData;
      });
      
      console.log("[MOBILE DEBUG] Form is valid, proceeding to processing");
      
      // Process the form - using real API submission
      setIsLoading(true);
      
      // Force state update for processing step
      setCurrentStep(4);
      
      // Collect all form data
      const completeFormData = {
        ...formData,
        ...formValues,
        email: formValues.email || 'not-provided@example.com',
        source: 'MVA-Rideshare-Website',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        submittedAt: new Date().toISOString(),
        xxTrustedFormCertUrl: typeof window !== 'undefined' ? 
          (document.querySelector('[name="xxTrustedFormCertUrl"]') as HTMLInputElement)?.value || '' : ''
      };
      
      try {
        console.log("[FORM] Submitting via proxy API");
        
        // Use our server-side proxy to handle both API submissions
        const proxyResponse = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(completeFormData)
        });
        
        const proxyResult = await proxyResponse.json();
        console.log("[FORM] Proxy API response:", proxyResult);
        
        // Log individual API results
        if (proxyResult.trustForms) {
          console.log("[FORM] TrustForms result:", proxyResult.trustForms);
        }
        
        if (proxyResult.aws) {
          console.log("[FORM] AWS API result:", proxyResult.aws);
        }
        
        // Handle submission results
        if (proxyResult.success) {
          setSubmissionSuccess(true);
          
          // Track successful claim submission with both client and server-side tracking
          trackEventWithRedundancy(
            events.LEAD, 
            {
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              phone: formValues.phone,
            },
            {
              content_name: 'Rideshare Claim',
              content_category: 'Claim Submission',
              status: 'Qualified'
            }
          );
          
          // Add a short delay before showing success screen
          setTimeout(() => {
            setIsLoading(false);
            setCurrentStep(5);
            console.log("[FORM] Form submission complete, showing success screen");
          }, 2000);
        } else {
          throw new Error(proxyResult.error || 'Failed to submit claim');
        }
      } catch (apiError) {
        console.error("[FORM] Proxy API submission error:", apiError);
        
        // Show the form error but still proceed to final step
        setFormError(apiError instanceof Error ? apiError.message : "An error occurred submitting your claim.");
        
        // Continue to final step anyway to not lose the user
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep(5);
          console.log("[FORM] Proceeding to final step despite API error");
        }, 2000);
      }
    } catch (error) {
      console.error('Error in submitStep3:', error);
      setFormError("An unexpected error occurred. Please try again.");
      
      // Attempt to recover
      setIsLoading(false);
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
    if (currentStep === 2) {
      // When going back to step 1, check if we should clear localStorage
      try {
        // Optionally clear saved data when returning to step 1
        // localStorage.removeItem('contactFormData');
        console.log("Returned to step 1");
      } catch (e) {
        console.error('Error interacting with localStorage:', e);
      }
    }
    setCurrentStep(prevStep => Math.max(1, prevStep - 1));
    setFormError(null);
  };

  // Calculate progress percentage
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* TrustedForm Script */}
      <Script id="trustedform-script" strategy="beforeInteractive">
        {`
        (function() {
          var tf = document.createElement('script');
          tf.type = 'text/javascript';
          tf.async = true;
          tf.src = ('https:' == document.location.protocol ? 'https' : 'http') + 
            '://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&use_tagged_consent=true&l=' + 
            new Date().getTime() + Math.random();
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(tf, s);
        })();
        `}
      </Script>
      <noscript>
        <img src="https://api.trustedform.com/ns.gif" />
      </noscript>
      {/* Hidden input field for TrustedForm */}
      <input type="hidden" name="xxTrustedFormCertUrl" id="xxTrustedFormCertUrl" />
      
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
              <div className="step1-container">
                <Step1BasicInfo 
                  register={register} 
                  errors={errors} 
                />
                {isMobileView && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Please provide your contact information before proceeding.
                    </p>
                  </div>
                )}
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
              <div className="flex flex-col items-center">
                <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <h2 className="text-2xl font-bold mb-4">Claim Successfully Uploaded</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Based on your information, your file has been escalated to a case manager. Please call to finalize your claim.
                </p>
                
                <a
                  href="tel:+18339986906" 
                  className="btn-primary text-lg py-4 px-8 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="hidden md:inline">Call +1 (833) 998-6906</span>
                  <span className="md:hidden">Click to Call</span>
                </a>
                
                <p className="text-sm text-gray-500 mt-6">
                  Your case manager will review your details and guide you through the next steps.
                </p>
              </div>
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
              href="tel:+18339986906"
              className="btn-primary"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="hidden md:inline">Call +1 (833) 998-6906</span>
                <span className="md:hidden">Please Click to Call a Case Manager Now</span>
              </div>
            </a>
          </div>
        )}
      </form>
    </div>
  );
} 