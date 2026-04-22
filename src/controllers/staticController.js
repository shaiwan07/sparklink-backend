function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/static/privacy-policy
exports.privacyPolicy = (req, res) => {
  res.status(200).json(apiResponse({
    status: true,
    message: 'Privacy Policy',
    data: [{
      title: 'Privacy Policy',
      last_updated: '2026-04-01',
      content: `SparkLink ("we", "our", "us") is committed to protecting your personal information.

1. Information We Collect
We collect information you provide directly: name, email, date of birth, photos, location, and preferences. We also collect usage data and device identifiers.

2. How We Use Your Information
We use your data to match you with compatible users, provide video call features, send notifications, and improve the app. We do not sell your data to third parties.

3. Data Sharing
Your profile is visible to other users within the app. We share data with service providers (cloud storage, push notifications, video calling) only as needed to operate the service.

4. Data Retention
You may delete your account at any time. Upon deletion, your profile and personal data are permanently removed within 30 days.

5. Security
We use industry-standard encryption (TLS in transit, AES at rest) to protect your data.

6. Contact
For privacy questions, contact us at privacy@sparklink.app.`,
    }],
  }));
};

// GET /api/static/terms
exports.termsAndConditions = (req, res) => {
  res.status(200).json(apiResponse({
    status: true,
    message: 'Terms & Conditions',
    data: [{
      title: 'Terms & Conditions',
      last_updated: '2026-04-01',
      content: `Welcome to SparkLink. By using our app you agree to these Terms.

1. Eligibility
You must be 18 or older to use SparkLink. By registering you confirm you meet this requirement.

2. Account Conduct
You agree not to post false information, harass other users, or use the app for any unlawful purpose. Violations may result in immediate account suspension or termination.

3. Video Calls
Video dates are limited to the SparkLink platform. Recording calls without the other user's consent is strictly prohibited.

4. Intellectual Property
All content, branding, and technology in the app is owned by SparkLink. You may not copy or distribute it without permission.

5. Termination
We reserve the right to suspend or terminate accounts that violate these Terms.

6. Limitation of Liability
SparkLink is not liable for the actions of other users. Use the app at your own discretion and report any misconduct promptly.

7. Changes
We may update these Terms at any time. Continued use of the app after changes constitutes acceptance.

8. Contact
legal@sparklink.app`,
    }],
  }));
};

// GET /api/static/about
exports.about = (req, res) => {
  res.status(200).json(apiResponse({
    status: true,
    message: 'About SparkLink',
    data: [{
      app_name: 'SparkLink',
      version: '1.0.0',
      tagline: 'Real connections. Real video dates.',
      description: `SparkLink is a dating app built around meaningful connections. Instead of endless swiping, SparkLink matches you with compatible people based on your values, interests, and goals — then gets you face-to-face on a scheduled video date.

How it works:
• Answer a short compatibility questionnaire.
• Browse curated potential matches.
• Like or Super-Like profiles.
• When you match, schedule a video date using your shared availability.
• Enjoy your SparkLink video date — and unlock exclusive rewards afterward.`,
      contact_email: 'support@sparklink.app',
      website: 'https://sparklink.app',
      social: {
        instagram: '@sparklink.app',
        tiktok: '@sparklink',
      },
    }],
  }));
};
