import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>Last Updated: October 15, 2023</p>
          
          <p>Welcome to DinnerDoodle! These Terms of Service ("Terms") govern your access to and use of the DinnerDoodle website and services. Please read these Terms carefully before using our services.</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using DinnerDoodle, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services. We may update these Terms from time to time, and your continued use of DinnerDoodle after any changes indicates your acceptance of the updated Terms.
          </p>
          
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use DinnerDoodle. By using our services, you represent and warrant that you meet this requirement. If you are under 18, you represent that you have your parent or guardian's permission to use our services.
          </p>
          
          <h2>3. Account Registration</h2>
          <p>
            To use certain features of DinnerDoodle, you may need to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>
          
          <h2>4. User Content</h2>
          <p>
            You retain all rights to any content you submit, post, or display on DinnerDoodle ("User Content"). By submitting User Content, you grant DinnerDoodle a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display your User Content in connection with the operation of our services.
          </p>
          
          <p>
            You are solely responsible for your User Content and the consequences of posting it. You represent and warrant that:
          </p>
          <ul>
            <li>You own or have the necessary rights to use and authorize us to use your User Content</li>
            <li>Your User Content does not violate any third party's intellectual property or privacy rights</li>
            <li>Your User Content complies with these Terms and applicable law</li>
          </ul>
          
          <h2>5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul>
            <li>Violating any applicable laws or regulations</li>
            <li>Impersonating any person or entity</li>
            <li>Harassing, threatening, or intimidating any person</li>
            <li>Posting or transmitting unauthorized commercial communications</li>
            <li>Interfering with or disrupting our services</li>
            <li>Attempting to gain unauthorized access to our services</li>
            <li>Using our services for any illegal or unauthorized purpose</li>
          </ul>
          
          <h2>6. Service Changes and Limitations</h2>
          <p>
            DinnerDoodle reserves the right to modify or discontinue, temporarily or permanently, our services with or without notice. We may also limit certain features or restrict your access to parts or all of our services without notice or liability.
          </p>
          
          <h2>7. Payment Terms</h2>
          <p>
            DinnerDoodle offers both free and premium services. By subscribing to a premium service, you agree to pay the applicable fees. All fees are non-refundable unless otherwise specified. We reserve the right to change our fees upon reasonable notice.
          </p>
          
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to our services at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use our services will immediately cease.
          </p>
          
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            DinnerDoodle is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
          </p>
          
          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, DinnerDoodle shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use our services.
          </p>
          
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
          </p>
          
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@dinnerdoodle.com.
          </p>
          
          <p className="mt-8 text-sm text-gray-600">
            By using DinnerDoodle, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;