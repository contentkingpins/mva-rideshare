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
import { submitToTrustForms } from '@/utils/trustforms';
import { prepareApiData, submitToApi } from '@/utils/api';
import Script from 'next/script';

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
      
      console.log('[MOBILE DEBUG] Mobile detection:', { 
        isMobile: mobileDetected,
        screenWidth: window.innerWidth, 
        userAgent: navigator.userAgent,
        hasTouch: hasTouch,
        isMobileScreen: isMobileScreen,
        isMobileUA: isMobileUA
      });
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

  // Debug mobile detection
  useEffect(() => {
    console.log('Mobile view state updated:', isMobileView);
  }, [isMobileView]);
  
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
    console.log('Current step changed to:', currentStep);
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
          console.log("Found saved contact data:", parsedData);
          
          // Set each field individually to ensure proper validation
          if (parsedData.firstName) setValue('firstName', parsedData.firstName);
          if (parsedData.lastName) setValue('lastName', parsedData.lastName);
          if (parsedData.phone) setValue('phone', parsedData.phone);
          if (parsedData.email) setValue('email', parsedData.email);
          
          setFormData(prev => ({ ...prev, ...parsedData }));
          
          // If we have complete contact data, skip to step 2
          if (parsedData.firstName && parsedData.lastName && 
              parsedData.phone && parsedData.email) {
            console.log("Skipping to step 2 with complete contact data");
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
    console.log(`Validating step ${currentStep}`);
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
    console.log(`Attempting to move from step ${currentStep} to next step`);
    
    // Log all form values for debugging
    const allValues = getValues();
    console.log('Current form values:', allValues);
    
    const isStepValid = await validateCurrentStep();
    console.log(`Step ${currentStep} validation result:`, isStepValid);
    
    if (!isStepValid) {
      console.error("Current step validation failed");
      setFormError("Please correct the errors before continuing.");
      return;
    }

    // Get current role value
    const currentRole = getValues('role');
    console.log(`Current role value: ${currentRole}`);

    if (currentStep === 2 && !currentRole) {
      console.error("No role selected, cannot proceed");
      setFormError("Please select your role in the accident.");
      return;
    }

    if (currentStep === 2 && currentRole === 'guest') {
      const guestInfo = getValues('rideshareUserInfo');
      console.log('Guest info value:', guestInfo);
      
      if (!guestInfo || guestInfo.trim() === '') {
        console.error("Guest info required but missing");
        setFormError("Please provide information about the rideshare user.");
        return;
      }
    }

    // Log current state before advancing
    console.log(`Form is valid, proceeding from step ${currentStep} to ${currentStep + 1}`);

    // Special handling for step 3
    if (currentStep === 3) {
      const noComplaint = !filedComplaint;
      const noPoliceReport = !hasPoliceReport;
      
      console.log(`Filed complaint: ${filedComplaint}, Has police report: ${hasPoliceReport}`);
      
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
    console.log(`Moving to step ${currentStep + 1} with data:`, formValues);
    setFormData(prev => ({ ...prev, ...formValues }));
    
    // Actually advance the step
    setCurrentStep(prev => {
      console.log(`Changing step from ${prev} to ${prev + 1}`);
      return prev + 1;
    });

    console.log(`Step should now be ${currentStep + 1}`);
  };

  // Add a direct form submission handler for step 1
  const submitStep1 = async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior if event is present
    if (e) {
      e.preventDefault();
      console.log("[MOBILE DEBUG] Preventing default in submitStep1 for event type:", e.type);
    }
    
    console.log("[MOBILE DEBUG] Direct submission for step 1 triggered");
    console.log("[MOBILE DEBUG] isMobileView:", isMobileView);
    
    try {
      // Get form values
      const formValues = getValues();
      console.log("[MOBILE DEBUG] Form values for step 1:", formValues);
      
      // Validate required fields
      const isValid = await trigger(['firstName', 'lastName', 'phone', 'email']);
      
      if (!isValid) {
        console.error("[MOBILE DEBUG] Step 1 validation failed");
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
        console.log("[MOBILE DEBUG] Saved contact data to localStorage");
      } catch (e) {
        console.error("[MOBILE DEBUG] Error saving to localStorage:", e);
      }
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        console.log("[MOBILE DEBUG] Updated form data:", newData);
        return newData;
      });
      
      console.log("[MOBILE DEBUG] BEFORE changing step to 2. Current step:", currentStep);
      
      // Force immediate step change for mobile
      setCurrentStep(2);
      
      // Double-check the state update happened
      setTimeout(() => {
        console.log("[MOBILE DEBUG] AFTER changing step. Current step:", currentStep);
        if (currentStep !== 2) {
          console.log("[MOBILE DEBUG] Forcing second attempt to change step");
          setCurrentStep(2);
        }
      }, 100);
      
    } catch (error) {
      console.error("[MOBILE DEBUG] Error in submitStep1:", error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  // Add a direct form submission handler for step 2
  const submitStep2 = async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior if event is present
    if (e) {
      e.preventDefault();
      console.log("Preventing default in submitStep2 for event type:", e.type);
    }
    
    console.log("[MOBILE DEBUG] Direct submission for step 2 triggered");
    console.log("[MOBILE DEBUG] isMobileView:", isMobileView);
    
    try {
      // Get form values
      const formValues = getValues();
      console.log("[MOBILE DEBUG] Form values for step 2:", formValues);
      
      // Make sure we have a role selected
      if (!formValues.role) {
        console.error("[MOBILE DEBUG] No role selected for step 2");
        setFormError("Please select your role in the accident.");
        return;
      }
      
      // Special handling for guest role
      if (formValues.role === 'guest' && (!formValues.rideshareUserInfo || formValues.rideshareUserInfo.trim() === '')) {
        console.error("[MOBILE DEBUG] Guest info required but missing");
        setFormError("Please provide information about the rideshare user.");
        return;
      }
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        console.log("[MOBILE DEBUG] Updated form data:", newData);
        return newData;
      });
      
      console.log("[MOBILE DEBUG] BEFORE changing step to 3. Current step:", currentStep);
      
      // Force immediate step change for mobile
      setCurrentStep(3);
      
      // Double-check the state update happened
      setTimeout(() => {
        console.log("[MOBILE DEBUG] AFTER changing step. Current step:", currentStep);
        if (currentStep !== 3) {
          console.log("[MOBILE DEBUG] Forcing second attempt to change step");
          setCurrentStep(3);
        }
      }, 100);
      
    } catch (error) {
      console.error("[MOBILE DEBUG] Error in submitStep2:", error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  // Add a direct form submission handler for step 3
  const submitStep3 = async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior if event is present
    if (e) {
      e.preventDefault();
      console.log("Preventing default in submitStep3 for event type:", e.type);
    }
    
    console.log("[MOBILE DEBUG] Direct submission for step 3 triggered");
    console.log("[MOBILE DEBUG] isMobileView:", isMobileView);
    
    try {
      // Get form values
      const formValues = getValues();
      console.log("[MOBILE DEBUG] Form values for step 3:", formValues);
      
      // Make sure we have a rideshare company selected
      if (!formValues.rideshareCompany) {
        console.error("[MOBILE DEBUG] No rideshare company selected for step 3");
        setFormError("Please select whether you were in an Uber or Lyft.");
        return;
      }
      
      // Check if accident date is provided
      if (!formValues.accidentDate) {
        console.error("[MOBILE DEBUG] No accident date provided");
        setFormError("Please provide the date when the accident occurred.");
        return;
      }
      
      // Check if either complaint or police report is true
      const hasComplaint = formValues.filedComplaint === true;
      const hasReport = formValues.hasPoliceReport === true;
      
      console.log(`[MOBILE DEBUG] Complaint: ${hasComplaint}, Police report: ${hasReport}`);
      
      if (!hasComplaint && !hasReport) {
        console.error("[MOBILE DEBUG] Neither complaint nor police report is present");
        setIsRejected(true);
        setRejectionReason('To process a rideshare claim, there must be either a rideshare report or a police report.');
        return;
      }
      
      // Check for medical treatment
      const hadMedicalTreatment48Hours = formValues.receivedMedicalTreatment48Hours === true;
      const hadMedicalTreatment7Days = formValues.receivedMedicalTreatment7Days === true;
      
      // If they didn't receive treatment within 48 hours and we don't have info about 7 days
      if (!hadMedicalTreatment48Hours && formValues.receivedMedicalTreatment7Days === undefined) {
        console.error("[MOBILE DEBUG] Missing information about medical treatment within 7 days");
        setFormError("Please indicate if you received medical treatment within 7 days of the accident.");
        return;
      }
      
      // If neither medical treatment option is selected, reject the claim
      if (!hadMedicalTreatment48Hours && !hadMedicalTreatment7Days) {
        console.error("[MOBILE DEBUG] No medical treatment received");
        setIsRejected(true);
        setRejectionReason('To process a rideshare injury claim, you must have received medical treatment within 7 days of the accident.');
        return;
      }
      
      // Save form data
      setFormData(prev => {
        const newData = { ...prev, ...formValues };
        console.log("[MOBILE DEBUG] Updated form data:", newData);
        return newData;
      });
      
      console.log("[MOBILE DEBUG] Form is valid, proceeding to processing");
      
      // Process the form - Change to actual API submission
      setIsLoading(true);
      
      console.log("[MOBILE DEBUG] BEFORE changing step to 4. Current step:", currentStep);
      
      // Force state update for processing step
      setCurrentStep(4);
      
      // Collect all form data
      const completeFormData = {
        ...formData,
        ...formValues,
        source: 'MVA-Rideshare-Website',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        submittedAt: new Date().toISOString()
      };
      
      try {
        // Prepare API data with proper formatting
        const apiData = prepareApiData(completeFormData);
        
        // Submit to ActiveProsper TrustForms
        const trustFormsResult = await submitToTrustForms(completeFormData);
        console.log("[FORM] TrustForms submission result:", trustFormsResult);
        
        // If TrustForms has an ID, add it to the AWS submission
        if (trustFormsResult.success && trustFormsResult.id) {
          apiData.trustFormsId = trustFormsResult.id;
        }
        
        // Submit to AWS API endpoint
        const apiResult = await submitToApi(apiData);
        console.log("[FORM] API submission result:", apiResult);
        
        // Handle submission results
        if (apiResult.success) {
          setSubmissionSuccess(true);
          
          // Add a short delay before showing success screen
          setTimeout(() => {
            setIsLoading(false);
            setCurrentStep(5);
            console.log("[MOBILE DEBUG] Step changed to 5 (final)");
          }, 2000);
        } else {
          throw new Error(apiResult.error || 'Failed to submit claim');
        }
      } catch (apiError) {
        console.error("[MOBILE DEBUG] API submission error:", apiError);
        
        // Show the form error but still proceed to final step
        setFormError(apiError instanceof Error ? apiError.message : "An error occurred submitting your claim.");
        
        // Continue to final step anyway to not lose the user
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep(5);
          console.log("[MOBILE DEBUG] Step changed to 5 (final) despite API error");
        }, 2000);
      }
    } catch (error) {
      console.error("[MOBILE DEBUG] Error in submitStep3:", error);
      setFormError("An unexpected error occurred. Please try again.");
      
      // Attempt to recover
      setIsLoading(false);
    }
  };

  // Handle the form submission
  const onSubmit = async (data: ClaimFormData) => {
    try {
      console.log(`Form submitted with data:`, data);
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

  // Add a helper function for mobile button clicks
  const handleMobileButtonClick = (step: number) => {
    console.log(`[MOBILE DEBUG] Mobile button click handler for step ${step}`);
    
    if (step === 1) {
      console.log("[MOBILE DEBUG] Directly calling submitStep1 from mobile handler");
      submitStep1();
    } else if (step === 2) {
      console.log("[MOBILE DEBUG] Directly calling submitStep2 from mobile handler");
      submitStep2();
    } else if (step === 3) {
      console.log("[MOBILE DEBUG] Directly calling submitStep3 from mobile handler");
      submitStep3();
    } else {
      console.log("[MOBILE DEBUG] Using standard form submit for step", step);
      handleSubmit(onSubmit)();
    }
  };

  // Add debug mode for step 1
  useEffect(() => {
    if (currentStep === 1 && isMobileView) {
      console.log('[MOBILE DEBUG] Step 1 active in mobile view');
      
      // Debug info about the environment
      console.log('[MOBILE DEBUG] Window dimensions:', {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio
      });
      
      console.log('[MOBILE DEBUG] User agent:', navigator.userAgent);
      
      // Add debug class to body
      document.body.classList.add('debug-step1');
      
      // Create debug overlay for mobile testing
      if (process.env.NODE_ENV !== 'production') {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'mobile-debug-overlay';
        debugDiv.style.position = 'fixed';
        debugDiv.style.bottom = '40px';
        debugDiv.style.left = '10px';
        debugDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        debugDiv.style.color = 'white';
        debugDiv.style.padding = '5px';
        debugDiv.style.borderRadius = '5px';
        debugDiv.style.fontSize = '10px';
        debugDiv.style.zIndex = '9999';
        debugDiv.innerHTML = 'Debug: Step 1 Mobile';
        
        // Add a direct trigger button for extreme cases
        const debugButton = document.createElement('button');
        debugButton.innerText = 'FORCE NEXT';
        debugButton.style.display = 'block';
        debugButton.style.margin = '5px 0';
        debugButton.style.padding = '5px';
        debugButton.style.backgroundColor = 'red';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '3px';
        debugButton.onclick = () => {
          console.log('[MOBILE DEBUG] Force next button clicked');
          setCurrentStep(2);
        };
        
        debugDiv.appendChild(debugButton);
        document.body.appendChild(debugDiv);
        
        return () => {
          document.body.removeChild(debugDiv);
          document.body.classList.remove('debug-step1');
        };
      }
      
      return () => {
        document.body.classList.remove('debug-step1');
      };
    }
  }, [currentStep, isMobileView]);

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

      <form onSubmit={handleSubmit(onSubmit)}
        onTouchStart={(e) => {
          if (currentStep === 1) {
            console.log("[MOBILE DEBUG] Form touch start detected");
          }
        }}
      >
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
              <div className="step1-container" 
                onTouchStart={() => console.log("[MOBILE DEBUG] Step1 container touch")}
                onTouchEnd={(e) => {
                  console.log("[MOBILE DEBUG] Step1 container touch end");
                  e.stopPropagation();
                }}
              >
                <Step1BasicInfo 
                  register={register} 
                  errors={errors} 
                />
                {/* Extra Continue Button inside form for iOS */}
                <div className="mt-4 text-center ios-only-button" style={{display: 'none'}}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      submitStep1(e);
                    }}
                    className="btn-primary inline-block py-3 px-8 text-lg"
                  >
                    iOS Continue
                  </button>
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
            
            {/* Special handling for step 2 */}
            {currentStep === 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log("CLICK EVENT FIRED for step 1 button");
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    if (!isSubmitting) {
                      console.log("Button clicked - submitStep1");
                      submitStep1(e);
                    }
                  }}
                  onTouchEnd={(e) => {
                    console.log("TOUCH END EVENT FIRED for step 1 button");
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    if (!isSubmitting) {
                      console.log("Touch event - submitStep1");
                      submitStep1(e);
                    }
                  }}
                  className="btn-primary relative px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                  disabled={isSubmitting}
                  aria-label="Continue to next step"
                  style={{touchAction: "none"}}
                >
                  Continue
                </button>
                {/* Mobile-only hidden button */}
                <div className="mobile-device-only">
                  <button
                    type="button"
                    onClick={() => handleMobileButtonClick(1)}
                    className="btn-primary fixed bottom-4 right-4 z-50 px-6 py-3 rounded-full shadow-lg"
                    style={{ opacity: 0.9 }}
                  >
                    Tap to Continue
                  </button>
                </div>
              </>
            ) : currentStep === 2 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log("CLICK EVENT FIRED for step 2 button");
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    if (!isSubmitting) {
                      console.log("Button clicked - submitStep2");
                      submitStep2(e);
                    }
                  }}
                  onTouchEnd={(e) => {
                    console.log("TOUCH END EVENT FIRED for step 2 button");
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    if (!isSubmitting) {
                      console.log("Touch event - submitStep2");
                      submitStep2(e);
                    }
                  }}
                  className="btn-primary relative px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                  disabled={isSubmitting}
                  aria-label="Continue to next step"
                  style={{touchAction: "none"}}
                >
                  Continue
                </button>
                {/* Mobile-only hidden button */}
                <div className="mobile-device-only">
                  <button
                    type="button"
                    onClick={() => handleMobileButtonClick(2)}
                    className="btn-primary fixed bottom-4 right-4 z-50 px-6 py-3 rounded-full shadow-lg"
                    style={{ opacity: 0.9 }}
                  >
                    Tap to Continue
                  </button>
                </div>
              </>
            ) : currentStep === 3 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log("CLICK EVENT FIRED for step 3 button");
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    if (!isSubmitting) {
                      console.log("Button clicked - submitStep3");
                      submitStep3(e);
                    }
                  }}
                  onTouchEnd={(e) => {
                    console.log("TOUCH END EVENT FIRED for step 3 button");
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    if (!isSubmitting) {
                      console.log("Touch event - submitStep3");
                      submitStep3(e);
                    }
                  }}
                  className="btn-primary relative px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                  disabled={isSubmitting}
                  aria-label="Submit information"
                  style={{touchAction: "none"}}
                >
                  Submit
                </button>
                {/* Mobile-only hidden button */}
                <div className="mobile-device-only">
                  <button
                    type="button"
                    onClick={() => handleMobileButtonClick(3)}
                    className="btn-primary fixed bottom-4 right-4 z-50 px-6 py-3 rounded-full shadow-lg"
                    style={{ opacity: 0.9 }}
                  >
                    Tap to Submit
                  </button>
                </div>
              </>
            ) : (
              <button
                type="submit"
                onClick={(e) => {
                  console.log("CLICK EVENT FIRED for default button");
                  if (currentStep < 4) {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                  }
                }}
                onTouchEnd={(e) => {
                  console.log("TOUCH END EVENT FIRED for default button");
                  if (currentStep < 4) {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                  }
                }}
                className="btn-primary relative px-5 py-3 sm:px-6 sm:py-3 text-base w-2/3 sm:w-auto touch-manipulation"
                disabled={isSubmitting}
                aria-label="Continue to next step"
                style={{touchAction: "none"}}
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