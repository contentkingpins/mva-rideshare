'use client';

import React from 'react';
import { useState } from 'react';

export default function TermsPage() {
  const [tcpaConsent, setTcpaConsent] = useState(false);

  return (
    <main className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using Claim Connectors' website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
            <p className="mb-4">
              Claim Connectors provides an online platform to help individuals involved in rideshare accidents connect with legal representation and process their injury claims. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Initial claim evaluation</li>
              <li>Connection with qualified legal representation</li>
              <li>Case status tracking</li>
              <li>Document collection and management</li>
              <li>Communication facilitation between parties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">By using our services, you agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account information</li>
              <li>Promptly respond to requests for information or documentation</li>
              <li>Not use our services for any unlawful purpose</li>
              <li>Not interfere with the proper operation of our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Service Fees</h2>
            <p>
              Our initial claim evaluation is provided free of charge. If you choose to proceed with legal representation through our network, fees will be handled on a contingency basis, meaning no upfront costs to you. Legal fees will be a percentage of any settlement or judgment obtained, as agreed upon with your assigned legal representation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee specific outcomes for any claim or case. Success of your claim depends on various factors including but not limited to the specific circumstances of your case, available evidence, and applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p>
              Claim Connectors shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. This includes but is not limited to damages for loss of profits, data, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Communication Consent and TCPA Agreement</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-semibold mb-4">TCPA Consent</h3>
              <p className="mb-4">
                By checking the box below, you expressly consent and agree to receive:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Marketing and promotional communications</li>
                <li>Claim status updates and notifications</li>
                <li>Document requests and submission confirmations</li>
                <li>Appointment reminders and scheduling communications</li>
                <li>Case-related information and updates</li>
              </ul>
              <p className="mb-4">
                These communications may be made using an automatic telephone dialing system or artificial/prerecorded voice and may be delivered via:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Phone calls to your provided telephone number(s)</li>
                <li>SMS/text messages to your provided mobile number(s)</li>
                <li>Emails to your provided email address(es)</li>
              </ul>
              <p className="mb-4">
                You understand and agree that these communications may be made by:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Claim Connectors</li>
                <li>Law Office of Michael Binder</li>
                <li>Our authorized representatives and service providers</li>
              </ul>
              <p className="mb-4">
                You acknowledge that:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your consent is not required to purchase any goods or services</li>
                <li>Message and data rates may apply</li>
                <li>The frequency of messages will vary based on your case status and preferences</li>
                <li>You can opt-out of SMS messages at any time by replying "STOP"</li>
                <li>You can opt-out of calls by informing the caller or contacting us directly</li>
              </ul>
              <div className="mt-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tcpaConsent}
                    onChange={(e) => setTcpaConsent(e.target.checked)}
                    className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm">
                    I have read and agree to the TCPA Consent terms above. I understand and consent to receiving calls, SMS messages, and other communications as described above.
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, and software, is the property of Claim Connectors and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our services at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Los Angeles County, California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4">
              <p>Email: legal@claimconnectors.com</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 