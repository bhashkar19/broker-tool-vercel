import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FindBroker by Paisowala',
  description: 'Privacy policy for FindBroker broker recommendation tool. Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow'
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-lg text-gray-600">FindBroker by Paisowala</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: October 3, 2025</p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            At Paisowala, we value the privacy and security of your personal information. This Privacy Policy explains
            how FindBroker (our broker recommendation tool at <strong>findbroker.paisowala.com</strong>) collects, uses,
            protects, and shares your data. By using our service, you agree to the terms outlined in this policy.
          </p>

          {/* Section 1: Services Covered */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Services Covered by This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This privacy policy specifically covers the <strong>FindBroker</strong> service, a broker recommendation
              tool operated by Paisowala. FindBroker is part of the broader Paisowala ecosystem, which includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Paisowala.com</strong> - Financial education and blog</li>
              <li><strong>Course.Paisowala.com</strong> - Online courses and workshops</li>
              <li><strong>FindBroker.Paisowala.com</strong> - Broker recommendation tool (covered by this policy)</li>
            </ul>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you use FindBroker, we collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Name:</strong> Your full name for broker communication</li>
              <li><strong>Mobile Number:</strong> Your 10-digit Indian mobile number for account opening</li>
              <li><strong>Email Address:</strong> Optional, for follow-up communications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Trading Preferences</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              To match you with suitable brokers, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Current broker(s) you have accounts with</li>
              <li>Your trading experience level (beginner, intermediate, advanced)</li>
              <li>Trading frequency (daily, weekly, monthly, occasional)</li>
              <li>Main challenges you face with your current broker</li>
              <li>Features you prioritize (cost, tools, support, research, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Technical & Tracking Data</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We automatically collect technical information to improve our service and track conversions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Facebook Click ID (fbclid):</strong> For ad conversion tracking</li>
              <li><strong>UTM Parameters:</strong> Campaign source, medium, and campaign name</li>
              <li><strong>Session ID:</strong> Unique identifier for your visit</li>
              <li><strong>IP Address:</strong> For spam prevention and geolocation</li>
              <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
              <li><strong>User Agent:</strong> Technical details about your browser</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Data */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. How We Use Your Information</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Broker Matching & Recommendations</h3>
              <p className="text-blue-800 text-sm">
                We analyze your trading preferences to recommend the most suitable broker based on your specific needs,
                experience level, and priorities.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Specific Uses:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Recommendation Algorithm:</strong> Match you with brokers that fit your profile</li>
              <li><strong>Partner Communication:</strong> Share your contact details with recommended broker (only after you click &quot;Open Account&quot;)</li>
              <li><strong>Analytics & Tracking:</strong> Measure tool effectiveness and conversion rates</li>
              <li><strong>Service Improvement:</strong> Understand user behavior to enhance our recommendation engine</li>
              <li><strong>Spam Prevention:</strong> Detect and prevent duplicate or fraudulent submissions</li>
              <li><strong>Customer Support:</strong> Respond to your questions or issues</li>
            </ul>
          </section>

          {/* Section 4: Broker Partners & Data Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Broker Partners & Data Sharing</h2>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
              <p className="text-amber-900 font-semibold mb-2">⚠️ Important: When Data is Shared</p>
              <p className="text-amber-800 text-sm">
                We <strong>ONLY</strong> share your contact information (name, mobile, email) with the recommended broker
                <strong> AFTER</strong> you click the &quot;Open Account&quot; button. We never share your data with all brokers
                or without your explicit action.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Our Broker Partners (SEBI Registered)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              FindBroker partners with the following SEBI-registered stockbrokers. We may share your contact details with
              these partners based on our recommendation and your explicit action:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Broker Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Regulation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Zerodha Securities</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Discount Broker</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">SEBI Registered</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Angel One (Angel Broking)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Full Service + Discount</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">SEBI Registered</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Upstox</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Discount Broker</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">SEBI Registered</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Fyers Securities</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Discount Broker</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">SEBI Registered</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">5paisa Capital</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Discount Broker</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">SEBI Registered</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">What Data We Share:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>✅ <strong>Contact Information:</strong> Name, mobile number, email (for account opening)</li>
              <li>✅ <strong>Referral Source:</strong> That you came from FindBroker/Paisowala</li>
              <li>❌ <strong>NOT Shared:</strong> Your trading preferences, challenges, or questionnaire responses</li>
              <li>❌ <strong>NOT Shared:</strong> Information about other brokers you have accounts with</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Purpose of Data Sharing:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Brokers use your contact information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Contact you for account opening process</li>
              <li>Verify your identity (KYC compliance)</li>
              <li>Send account opening links and instructions</li>
              <li>Provide customer support during onboarding</li>
            </ul>
          </section>

          {/* Section 5: Facebook Pixel & Third-Party Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Facebook Pixel & Third-Party Tracking</h2>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">What is Facebook Pixel?</h3>
              <p className="text-purple-800 text-sm">
                Facebook Pixel is a tracking code that helps us measure the effectiveness of our advertising campaigns
                and improve ad targeting. It collects data about your actions on our website.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">We Use Facebook Pixel To:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Measure Conversions:</strong> Track how many people submit the form after clicking our ads</li>
              <li><strong>Optimize Ads:</strong> Show our ads to people most likely to benefit from FindBroker</li>
              <li><strong>Create Custom Audiences:</strong> Retarget users who visited but didn&apos;t complete the form</li>
              <li><strong>Improve Ad Delivery:</strong> Show ads to people similar to our existing users</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Data Facebook Pixel Collects:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Pages you visit on FindBroker</li>
              <li>Actions you take (button clicks, form submissions, question answers)</li>
              <li>Device information (browser, operating system, screen resolution)</li>
              <li>IP address and general location (city/state level)</li>
              <li>Facebook Click ID (if you came from a Facebook ad)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Google Analytics:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We also use Google Analytics to understand how users interact with FindBroker. Google Analytics collects
              similar data to Facebook Pixel (page views, session duration, bounce rate, etc.) to help us improve the tool.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">How to Opt-Out of Tracking:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Use browser extensions like Privacy Badger or uBlock Origin</li>
              <li>Enable &quot;Do Not Track&quot; in your browser settings</li>
              <li>Visit <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Ad Preferences</a> to control ad targeting</li>
              <li>Install <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
            </ul>
          </section>

          {/* Section 6: Your Consent & Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Your Consent & Rights</h2>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">✓ Explicit Consent</h3>
              <p className="text-green-800 text-sm mb-2">
                By using FindBroker and clicking the <strong>&quot;Open Account&quot;</strong> button, you explicitly consent to:
              </p>
              <ul className="list-disc list-inside text-green-800 text-sm space-y-1 ml-4">
                <li>Collection of your contact information and trading preferences</li>
                <li>Sharing your contact details with the recommended broker</li>
                <li>Facebook Pixel and Google Analytics tracking</li>
                <li>Communication from Paisowala and broker partners</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Your Rights Under DPDPA 2023:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a data principal under India&apos;s Digital Personal Data Protection Act (DPDPA) 2023, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
              <li><strong>Right to Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Withdraw Consent:</strong> Opt-out of data sharing or communications at any time</li>
              <li><strong>Right to Nominate:</strong> Nominate another person to exercise your rights in case of death/incapacity</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">How to Exercise Your Rights:</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              To exercise any of these rights, contact us at:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-gray-800"><strong>Email:</strong> <a href="mailto:support@paisowala.com" className="text-blue-600 hover:underline">support@paisowala.com</a></p>
              <p className="text-gray-800 mt-2"><strong>Subject:</strong> &quot;FindBroker Privacy Request - [Your Request Type]&quot;</p>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              We will respond to your request within 7-14 business days. For data deletion requests, we may retain certain
              information for legal, administrative, or security purposes as required by law.
            </p>
          </section>

          {/* Section 7: Data Retention & Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Data Retention & Security</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">How Long We Keep Your Data:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Contact Information:</strong> Retained for up to 2 years for customer support and follow-ups</li>
              <li><strong>Trading Preferences:</strong> Retained for up to 1 year for analytics and service improvement</li>
              <li><strong>Analytics Data:</strong> Anonymized after 6 months, aggregated data retained indefinitely</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law or regulation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Data Security Measures:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Encryption:</strong> All data transmitted via HTTPS (SSL/TLS encryption)</li>
              <li><strong>Database Security:</strong> Data stored in secure, encrypted databases (Supabase)</li>
              <li><strong>Access Control:</strong> Only authorized personnel can access user data</li>
              <li><strong>Rate Limiting:</strong> Spam protection to prevent unauthorized data collection</li>
              <li><strong>Regular Audits:</strong> Periodic security reviews and updates</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Data Breach Notification:</h3>
            <p className="text-gray-700 leading-relaxed">
              In the unlikely event of a data breach, we will notify affected users within 72 hours via email and/or SMS,
              as required by DPDPA 2023. We will also report the breach to the Data Protection Board of India if required.
            </p>
          </section>

          {/* Section 8: Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Paisowala Privacy Team</h3>
              <div className="space-y-2">
                <p className="text-blue-800"><strong>Email:</strong> <a href="mailto:support@paisowala.com" className="text-blue-600 hover:underline">support@paisowala.com</a></p>
                <p className="text-blue-800"><strong>Website:</strong> <a href="https://paisowala.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">paisowala.com</a></p>
                <p className="text-blue-800"><strong>Service:</strong> FindBroker at <a href="https://findbroker.paisowala.com" className="text-blue-600 hover:underline">findbroker.paisowala.com</a></p>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              We aim to respond to all privacy inquiries within 7-14 business days. For urgent matters, please mark your
              email as &quot;URGENT&quot; in the subject line.
            </p>
          </section>

          {/* Policy Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal
              requirements. When we make significant changes, we will:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Update the &quot;Last Updated&quot; date at the top of this page</li>
              <li>Notify active users via email (if we have your email address)</li>
              <li>Display a prominent notice on FindBroker for 30 days</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your data.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of <strong>October 3, 2025</strong> and applies to all users of FindBroker.
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              © 2025 Paisowala. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
