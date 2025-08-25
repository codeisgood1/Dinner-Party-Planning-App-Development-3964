import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>Last Updated: October 15, 2023</p>
          
          <p>At DinnerDoodle, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of DinnerDoodle:
          </p>
          
          <h3>Personal Information</h3>
          <ul>
            <li><strong>Account information:</strong> When you create an account, we collect your name, email address, and password.</li>
            <li><strong>Profile information:</strong> You may choose to provide additional information such as a profile picture or dietary preferences.</li>
            <li><strong>Event information:</strong> When you create or join events, we collect event details, guest lists, and dish assignments.</li>
            <li><strong>Communications:</strong> We collect messages and comments you share through our platform.</li>
          </ul>
          
          <h3>Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage data:</strong> We collect information about how you interact with our services, including access times, pages viewed, and links clicked.</li>
            <li><strong>Device information:</strong> We collect information about your device, including IP address, browser type, operating system, and device identifiers.</li>
            <li><strong>Cookies and similar technologies:</strong> We use cookies and similar tracking technologies to enhance your experience and collect information about how you use our services.</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, offers, and events</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Personalize and improve your experience</li>
          </ul>
          
          <h2>3. Information Sharing</h2>
          <p>
            We may share your information in the following circumstances:
          </p>
          <ul>
            <li><strong>With other users:</strong> When you create or join events, certain information is shared with other participants.</li>
            <li><strong>With service providers:</strong> We may share information with third-party vendors who provide services on our behalf.</li>
            <li><strong>For legal reasons:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
            <li><strong>Business transfers:</strong> If DinnerDoodle is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            <li><strong>With your consent:</strong> We may share information with third parties when you have given us your consent to do so.</li>
          </ul>
          
          <p>
            We do not sell your personal information to third parties.
          </p>
          
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
          
          <h2>5. Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Data portability (receiving a copy of your data)</li>
            <li>Withdraw consent</li>
          </ul>
          
          <p>
            To exercise these rights, please contact us using the information provided at the end of this policy.
          </p>
          
          <h2>6. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information without parental consent, please contact us.
          </p>
          
          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the one in which you reside. These countries may have data protection laws that differ from your country. By using our services, you consent to the transfer of your information to these countries.
          </p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@dinnerdoodle.com<br />
            Address: 123 Party Street, Suite 100, San Francisco, CA 94107
          </p>
          
          <p className="mt-8 text-sm text-gray-600">
            By using DinnerDoodle, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;