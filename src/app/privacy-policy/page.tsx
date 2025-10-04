import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - FindBroker by Paisowala',
  description: 'Privacy policy for FindBroker broker recommendation tool. Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow'
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to FindBroker */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          ← Back to FindBroker
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200 text-center">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-1">Paisowala</h1>
            <p className="text-sm text-gray-500">FindBroker Privacy Policy</p>
          </div>
          <p className="text-sm text-gray-500">Last Updated: October 3, 2025</p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span> Your Data Protected
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span> SEBI Partners
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span> Transparent Practices
          </span>
        </div>

        {/* TL;DR Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            TL;DR (The Quick Version)
          </h2>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">•</span>
              <span>We collect your name, mobile number, and trading preferences to recommend the best broker for you</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">•</span>
              <span>We <strong>only share your contact info with ONE broker</strong> - the one we recommend, and only after you click &quot;Open Account&quot;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">•</span>
              <span>We use cookies and analytics to improve our service and show relevant ads</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">•</span>
              <span>You can request your data or delete it anytime by emailing us</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-10">
            Hey! Thanks for using FindBroker. We respect your privacy and want to be transparent about what we do with your information.
            This policy explains everything in plain English - no legal mumbo jumbo (well, mostly).
          </p>

          {/* Section 1: What We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
              <span className="text-3xl">📝</span>
              What Information We Collect
            </h2>

            <div className="bg-gray-50 rounded-lg p-5 mb-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Details:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span><strong>Name & Mobile:</strong> So brokers can contact you for account opening</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span><strong>Email:</strong> Optional, for follow-ups and updates</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 mb-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Trading Info:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Your current broker and account status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Trading experience and frequency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Challenges you face and features you want</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Stuff:</h3>
              <p className="text-gray-700 text-sm mb-2">
                Like most websites, we automatically collect some technical data to improve our service:
              </p>
              <ul className="space-y-1 text-gray-700 text-sm ml-4">
                <li>• IP address and location (city level, not exact address)</li>
                <li>• Device type and browser info</li>
                <li>• How you found us (Google, Facebook ad, etc.)</li>
                <li>• Pages you visit and buttons you click</li>
              </ul>
            </div>
          </section>

          {/* Section 2: How We Use Your Data */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              How We Use Your Information
            </h2>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Match You With The Right Broker</h4>
                  <p className="text-sm">We analyze your answers to recommend a broker that fits your needs - that&apos;s literally the whole point of FindBroker!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share Your Details With Your Match</h4>
                  <p className="text-sm">When you click &quot;Open Account&quot;, we send your name, mobile, and email to that specific broker so they can help you get started.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Improve Our Service</h4>
                  <p className="text-sm">We track how people use FindBroker to fix bugs, improve recommendations, and make the experience better.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Show You Relevant Ads</h4>
                  <p className="text-sm">We use cookies and analytics (Google, Facebook, etc.) to understand our audience and show ads to people who might benefit from FindBroker.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Who We Share With */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
              <span className="text-3xl">🤝</span>
              Who We Share Your Data With
            </h2>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 mb-6 rounded-r-lg">
              <p className="text-amber-900 font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Important: Here&apos;s Exactly When We Share Your Info
              </p>
              <p className="text-amber-800">
                We <strong>ONLY</strong> share your contact details (name, mobile, email) with <strong>ONE broker</strong> -
                the one we recommend to you - and <strong>ONLY AFTER</strong> you click the &quot;Open Account&quot; button.
                We never spam all brokers with your info.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Broker Partners:</h3>
            <p className="text-gray-700 mb-4">
              We work with trusted, SEBI-registered brokers including Zerodha, Angel One, Upstox, Fyers, and 5paisa.
              All are legit, regulated brokers - we only recommend based on what fits your needs.
            </p>

            <div className="bg-blue-50 rounded-lg p-5 mb-5">
              <h4 className="font-semibold text-blue-900 mb-3">What We Share:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Your name, mobile, and email (for account opening)
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  That you came from FindBroker/Paisowala
                </p>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-5">
              <h4 className="font-semibold text-red-900 mb-3">What We DON&apos;T Share:</h4>
              <div className="space-y-2 text-sm text-red-800">
                <p className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Your questionnaire answers or trading preferences
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Info about other brokers you have accounts with
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Your challenges or pain points
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Cookies & Tracking */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
              <span className="text-3xl">🍪</span>
              Cookies & Tracking
            </h2>

            <p className="text-gray-700 mb-5">
              Like pretty much every website on the internet, we use cookies and analytics tools to understand how people use FindBroker.
              This helps us improve the tool and show ads to the right people.
            </p>

            <div className="bg-purple-50 rounded-lg p-5 mb-5">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">What We Track:</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span><strong>Page views:</strong> Which pages you visit on FindBroker</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span><strong>Button clicks:</strong> What you click on (helps us improve UX)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span><strong>Form submissions:</strong> When someone completes the questionnaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span><strong>Ad performance:</strong> Which ads bring the most helpful users</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tools We Use:</h3>
              <p className="text-gray-700 text-sm mb-3">
                We use standard analytics and advertising platforms like Google Analytics and Facebook Pixel.
                These are industry-standard tools used by millions of websites.
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Don&apos;t like tracking?</strong> You can use browser extensions like Privacy Badger, enable &quot;Do Not Track&quot;
                in your browser, or adjust your ad preferences on Google and Facebook.
              </p>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              Your Rights & Control
            </h2>

            <p className="text-gray-700 mb-5">
              This is your data. You have full control over it. Here&apos;s what you can do:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">✓ Access Your Data</h4>
                <p className="text-sm text-green-800">Request a copy of everything we have about you</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">✓ Update Info</h4>
                <p className="text-sm text-blue-800">Correct any inaccurate information</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">✓ Delete Everything</h4>
                <p className="text-sm text-red-800">Request complete deletion of your data</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">✓ Opt-Out</h4>
                <p className="text-sm text-purple-800">Stop communications or data sharing</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm">
              To exercise any of these rights, just email us at{' '}
              <a href="mailto:support@paisowala.com" className="text-blue-600 hover:underline font-medium">
                support@paisowala.com
              </a>
              {' '}with subject &quot;Privacy Request&quot; and we&apos;ll respond within 7-14 business days.
            </p>
          </section>

          {/* Section 6: Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
              <span className="text-3xl">🔒</span>
              How We Protect Your Data
            </h2>

            <p className="text-gray-700 mb-5">
              We take security seriously. Your data is protected with:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🔐</div>
                <h4 className="font-semibold text-gray-900 mb-1">Encryption</h4>
                <p className="text-sm text-gray-600">All data encrypted in transit (HTTPS)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">💾</div>
                <h4 className="font-semibold text-gray-900 mb-1">Secure Storage</h4>
                <p className="text-sm text-gray-600">Data stored in encrypted databases</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🚫</div>
                <h4 className="font-semibold text-gray-900 mb-1">Access Control</h4>
                <p className="text-sm text-gray-600">Only authorized team members</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-5">
              We keep your contact info for up to 2 years for customer support. Trading preferences are anonymized after 6 months.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <span className="text-3xl">💬</span>
                Questions? We&apos;re Here to Help
              </h2>
              <p className="mb-6 text-blue-50">
                Got privacy questions or concerns? Don&apos;t hesitate to reach out.
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:support@paisowala.com"
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg px-5 py-3 transition-colors"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-semibold">support@paisowala.com</p>
                    <p className="text-sm text-blue-100">We respond within 7-14 business days</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 bg-white/10 rounded-lg px-5 py-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <p className="font-semibold">Paisowala.com</p>
                    <p className="text-sm text-blue-100">Visit our main website</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Compliance Footer */}
          <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-600">
            <p className="mb-2">
              <strong className="text-gray-800">Legal Stuff:</strong> This privacy policy complies with India&apos;s Digital Personal
              Data Protection Act (DPDPA) 2023 and other applicable privacy laws. We may update this policy occasionally -
              if we make major changes, we&apos;ll notify you via email.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              This policy is part of the Paisowala ecosystem, which includes Paisowala.com (financial education),
              Course.Paisowala.com (online courses), and FindBroker.Paisowala.com (this tool).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 mt-10">
          <p className="text-sm text-gray-500 text-center mb-3">
            Effective Date: <strong>October 3, 2025</strong>
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/" className="text-blue-600 hover:underline">← Back to FindBroker</Link>
            <span className="text-gray-300">•</span>
            <a href="https://paisowala.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Paisowala.com</a>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">© 2025 Paisowala</span>
          </div>
        </div>
      </div>
    </div>
  );
}
