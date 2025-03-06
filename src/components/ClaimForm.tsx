"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schemas using Zod
const contactSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  tcpaConsent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the TCPA consent to proceed',
  }),
});

const accidentSchema = z.object({
  role: z.enum(['driver', 'passenger', 'guest', 'other_vehicle'], {
    required_error: 'Please select your role in the accident',
  }),
  atFault: z.enum(['yes', 'no', 'unknown'], {
    required_error: 'Please indicate if the other vehicle was at fault',
  }).optional(),
  guestInfo: z.string().optional(),
});

const legalSchema = z.object({
  rideshareComplaint: z.enum(['yes', 'no'], {
    required_error: 'Please indicate if you filed a complaint',
  }),
  policeReport: z.enum(['yes', 'no'], {
    required_error: 'Please indicate if there is a police report',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;
type AccidentFormData = z.infer<typeof accidentSchema>;
type LegalFormData = z.infer<typeof legalSchema>;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function ClaimForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showDenial, setShowDenial] = useState(false);
  const [denialReason, setDenialReason] = useState('');
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  
  // Form hooks for each step
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      tcpaConsent: false,
    },
  });
  
  const accidentForm = useForm<AccidentFormData>({
    resolver: zodResolver(accidentSchema),
    defaultValues: {
      role: undefined,
      atFault: undefined,
      guestInfo: '',
    },
  });
  
  const legalForm = useForm<LegalFormData>({
    resolver: zodResolver(legalSchema),
    defaultValues: {
      rideshareComplaint: undefined,
      policeReport: undefined,
    },
  });
  
  // Check for saved contact data from the landing page
  useEffect(() => {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        contactForm.reset(parsedData);
        setFormData((prev: any) => ({ ...prev, ...parsedData }));
        // Auto-advance to step 2 if we have contact data
        setStep(2);
      } catch (error) {
        console.error('Error parsing saved contact data:', error);
      }
    }
  }, []);
  
  // Handle form submissions for each step
  const handleContactSubmit = (data: ContactFormData) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
  };
  
  const handleAccidentSubmit = (data: AccidentFormData) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    
    // Only apply denial logic for specific cases
    if (data.role === 'driver' && data.atFault === 'no') {
      setDenialReason('Unfortunately, we cannot find you representation at this time as you were the driver and the other vehicle was not at fault.');
      setShowDenial(true);
      return;
    }
    
    // For guest role, only check if info is required and provided
    if (data.role === 'guest') {
      if (!data.guestInfo || data.guestInfo.trim() === '') {
        setDenialReason('To proceed, we need the rideshare user\'s information.');
        setShowDenial(true);
        return;
      }
    }
    
    // If we reach here, proceed to next step
    setStep(3);
  };
  
  const handleLegalSubmit = (data: LegalFormData) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    
    // Apply denial logic for no complaint and no police report
    if (data.rideshareComplaint === 'no' && data.policeReport === 'no') {
      setDenialReason('To process a rideshare claim, there must be either a rideshare report or a police report. Unfortunately, we cannot proceed with your claim at this time.');
      setShowDenial(true);
      return;
    }
    
    // Start processing animation
    startProcessing();
  };
  
  // Processing animation
  const startProcessing = () => {
    setStep(4);
    setIsProcessing(true);
    
    const steps = [
      'Verifying claim details...',
      'Assessing liability and insurance coverage...',
      'Running compensation estimator...',
      'Finalizing results...',
    ];
    
    setProcessingSteps(steps);
    
    // Simulate processing steps with delays
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setCurrentProcessingStep(currentStep);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setIsComplete(true);
          setStep(5);
        }, 1000);
      }
    }, 1500);
  };
  
  // Watch for role changes to show/hide conditional fields
  const accidentRole = accidentForm.watch('role');
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (showDenial) return 100;
    if (step === 1) return 20;
    if (step === 2) return 40;
    if (step === 3) return 60;
    if (step === 4) return isComplete ? 100 : 80 + (currentProcessingStep * 5);
    return 100;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Progress Bar */}
      {!showDenial && !isComplete && (
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-500 ease-in-out"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Contact Info</span>
            <span>Accident Details</span>
            <span>Legal Info</span>
            <span>Complete</span>
          </div>
        </div>
      )}
      
      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    className={`input ${contactForm.formState.errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="John"
                    {...contactForm.register('firstName')}
                  />
                  {contactForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{contactForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="label">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className={`input ${contactForm.formState.errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Doe"
                    {...contactForm.register('lastName')}
                  />
                  {contactForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{contactForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="label">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className={`input ${contactForm.formState.errors.phone ? 'border-red-500' : ''}`}
                  placeholder="(555) 555-5555"
                  {...contactForm.register('phone')}
                />
                {contactForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{contactForm.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`input ${contactForm.formState.errors.email ? 'border-red-500' : ''}`}
                  placeholder="john@example.com"
                  {...contactForm.register('email')}
                />
                {contactForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{contactForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-base font-semibold mb-2">TCPA Consent</h3>
                <div className="text-sm text-gray-600">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      {...contactForm.register('tcpaConsent')}
                      className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      By checking this box, I consent to receive calls, texts & emails (including via automated systems) from Claim Connectors, Law Office of Michael Binder & partners about my claim and marketing. Consent isn't required to purchase services. Msg & data rates may apply. Reply STOP to opt-out of SMS.
                    </span>
                  </label>
                  {contactForm.formState.errors.tcpaConsent && (
                    <p className="mt-2 text-sm text-red-600">{contactForm.formState.errors.tcpaConsent.message}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className={`w-full ${
                    !contactForm.watch('tcpaConsent') 
                      ? 'btn-disabled bg-gray-300 cursor-not-allowed' 
                      : 'btn-primary'
                  }`}
                  disabled={!contactForm.watch('tcpaConsent')}
                >
                  {!contactForm.watch('tcpaConsent') 
                    ? 'Please Accept TCPA Consent to Submit' 
                    : 'Submit Your Claim'
                  }
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Step 2: Accident Involvement */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-6">Accident Involvement</h2>
            <form onSubmit={accidentForm.handleSubmit(handleAccidentSubmit)} className="space-y-6">
              <div>
                <label className="label">What was your role in the rideshare accident?</label>
                <div className="space-y-3 mt-2">
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="driver"
                      className="h-5 w-5 text-primary-600"
                      {...accidentForm.register('role')}
                    />
                    <span>I was the rideshare driver</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="passenger"
                      className="h-5 w-5 text-primary-600"
                      {...accidentForm.register('role')}
                    />
                    <span>I was a passenger in a rideshare vehicle</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="guest"
                      className="h-5 w-5 text-primary-600"
                      {...accidentForm.register('role')}
                    />
                    <span>I was a guest traveling with a rideshare user</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="other_vehicle"
                      className="h-5 w-5 text-primary-600"
                      {...accidentForm.register('role')}
                    />
                    <span>I was in another vehicle hit by a rideshare car</span>
                  </label>
                </div>
                {accidentForm.formState.errors.role && (
                  <p className="mt-1 text-sm text-red-600">{accidentForm.formState.errors.role.message}</p>
                )}
              </div>
              
              {/* Conditional follow-up questions */}
              {accidentRole === 'driver' && (
                <div className="pl-4 border-l-4 border-primary-200 py-2">
                  <label className="label">Was the other vehicle at fault?</label>
                  <div className="space-y-3 mt-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        value="yes"
                        className="h-5 w-5 text-primary-600"
                        {...accidentForm.register('atFault')}
                      />
                      <span>Yes</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        value="no"
                        className="h-5 w-5 text-primary-600"
                        {...accidentForm.register('atFault')}
                      />
                      <span>No</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        value="unknown"
                        className="h-5 w-5 text-primary-600"
                        {...accidentForm.register('atFault')}
                      />
                      <span>I'm not sure</span>
                    </label>
                  </div>
                  {accidentForm.formState.errors.atFault && (
                    <p className="mt-1 text-sm text-red-600">{accidentForm.formState.errors.atFault.message}</p>
                  )}
                </div>
              )}
              
              {accidentRole === 'guest' && (
                <div className="pl-4 border-l-4 border-primary-200 py-2">
                  <label htmlFor="guestInfo" className="label">
                    Please provide the rideshare user's information (Name & Contact)
                  </label>
                  <textarea
                    id="guestInfo"
                    className={`input h-24 ${accidentForm.formState.errors.guestInfo ? 'border-red-500' : ''}`}
                    placeholder="Name and contact information of the person who ordered the rideshare"
                    {...accidentForm.register('guestInfo')}
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    This information is required to proceed with your claim.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="btn-outline"
                >
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Continue to Legal Information
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Step 3: Legal & Insurance Qualification */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-6">Legal & Insurance Information</h2>
            <form onSubmit={legalForm.handleSubmit(handleLegalSubmit)} className="space-y-6">
              <div>
                <label className="label">Did you file a complaint with the rideshare app?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      className="h-5 w-5 text-primary-600"
                      {...legalForm.register('rideshareComplaint')}
                    />
                    <span>Yes</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      className="h-5 w-5 text-primary-600"
                      {...legalForm.register('rideshareComplaint')}
                    />
                    <span>No</span>
                  </label>
                </div>
                {legalForm.formState.errors.rideshareComplaint && (
                  <p className="mt-1 text-sm text-red-600">{legalForm.formState.errors.rideshareComplaint.message}</p>
                )}
              </div>

              <div>
                <label className="label">Was a police report filed?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      className="h-5 w-5 text-primary-600"
                      {...legalForm.register('policeReport')}
                    />
                    <span>Yes</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      className="h-5 w-5 text-primary-600"
                      {...legalForm.register('policeReport')}
                    />
                    <span>No</span>
                  </label>
                </div>
                {legalForm.formState.errors.policeReport && (
                  <p className="mt-1 text-sm text-red-600">{legalForm.formState.errors.policeReport.message}</p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="btn-outline"
                >
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Submit Claim
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Step 4: Processing Animation */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center py-8"
          >
            <h2 className="text-2xl font-bold mb-8">Processing Your Claim</h2>
            
            <div className="max-w-md mx-auto">
              <div className="relative pt-4">
                {processingSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center mb-6 ${index > currentProcessingStep ? 'opacity-40' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index < currentProcessingStep 
                        ? 'bg-green-500 text-white' 
                        : index === currentProcessingStep 
                          ? 'bg-primary-500 text-white animate-pulse' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentProcessingStep ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${index === currentProcessingStep ? 'text-primary-600' : 'text-gray-700'}`}>
                        {step}
                      </p>
                      {index === currentProcessingStep && (
                        <div className="w-12 h-1 mt-1 bg-primary-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-600 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 5: Final Call to Action */}
        {step === 5 && (
          <motion.div
            key="step5"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center py-8"
          >
            <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <h2 className="text-2xl font-bold mb-4">Your Claim Has Been Processed!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Based on your provided information, we are escalating this to a claims specialist. Please call now for immediate assistance!
            </p>
            
            <a 
              href="tel:8885555555" 
              className="btn-primary text-lg py-4 px-8 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now to Finalize Your Claim
            </a>
            
            <p className="text-sm text-gray-500 mt-6">
              One of our specialists will review your case details and provide you with the next steps.
            </p>
          </motion.div>
        )}
        
        {/* Denial Screen */}
        {showDenial && (
          <motion.div
            key="denial"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center py-8"
          >
            <svg className="w-20 h-20 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <h2 className="text-2xl font-bold mb-4">We're Sorry</h2>
            <p className="text-lg text-gray-600 mb-8">
              {denialReason}
            </p>
            
            <a 
              href="tel:8885555555" 
              className="btn-primary text-lg py-4 px-8 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Speak to a Claims Expert Now
            </a>
            
            <p className="text-sm text-gray-500 mt-6">
              Our experts may be able to suggest other legal options for your situation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 