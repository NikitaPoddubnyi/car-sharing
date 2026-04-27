export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  title: string;
  items: FaqItem[];
};

export const faqData: FaqCategory[] = [
  {
    title: 'General',
    items: [
      {
        question: 'What Is This Platform And How Does It Work?',
        answer:
          'Our platform allows you to rent cars or bikes by selecting your location and dates. Browse available options, book instantly, and manage everything from your account. You can compare prices, read reviews, and choose the vehicle that best suits your needs.',
      },
      {
        question: 'Do I Need An Account To Book A Vehicle?',
        answer:
          'Yes, creating an account is required to complete bookings and manage your reservations securely. It only takes a minute and gives you access to your booking history, favorites, and exclusive offers.',
      },
      {
        question: 'What Payment Methods Are Accepted?',
        answer:
          'We accept major credit and debit cards including Visa, MasterCard, and American Express. We also support PayPal, Apple Pay, and Google Pay depending on your region.',
      },
      {
        question: 'Can I Cancel My Booking?',
        answer:
          'Yes, bookings can be canceled from your account. Free cancellation is available up to 24 hours before pickup. Cancellations after that may be subject to a small fee.',
      },
      {
        question: 'Are There Any Hidden Fees?',
        answer:
          "No, there are no hidden fees. All costs including taxes and service fees are clearly shown before checkout. You'll only pay extra for damages or late returns.",
      },
    ],
  },

  {
    title: 'Security',
    items: [
      {
        question: 'Is My Personal Information Secure?',
        answer:
          'Yes, we use industry-standard encryption to protect your personal data. We never share your information with third parties without your explicit consent.',
      },
      {
        question: 'How Do You Protect My Payment Details?',
        answer:
          'All payments are processed through secure, PCI-compliant providers. Your full payment details are never stored on our servers.',
      },
      {
        question: 'What Should I Do If I Notice Suspicious Activity?',
        answer:
          'Contact our support team immediately and change your password. We will investigate and take appropriate action to secure your account.',
      },
      {
        question: 'Can I Change My Password Anytime?',
        answer:
          'Yes, you can update your password anytime in your account settings. We recommend changing it regularly for better security.',
      },
      {
        question: 'Do You Verify Drivers?',
        answer:
          'Yes, all users must provide valid identification and driving credentials before their first booking. This ensures safety for everyone.',
      },
    ],
  },

  {
    title: 'Booking',
    items: [
      {
        question: 'How Do I Find A Car Or Bike For Trip?',
        answer:
          'Simply enter your pickup location, dates, and times. Browse our selection of available vehicles, compare prices, and book the one you like best.',
      },
      {
        question: 'How Can I Extend My Trip Date After Booking?',
        answer:
          "Go to your active bookings in your account dashboard and click 'Extend'. Choose your new return date and confirm. Additional charges may apply.",
      },
      {
        question: 'How Do I Extend My Trip?',
        answer:
          'Open your booking details, select new dates, and confirm the extension. Make sure to do this before your original rental period ends.',
      },
      {
        question: 'Am I Responsible For Fuel?',
        answer:
          'Yes, you should return the vehicle with the same fuel level as when you picked it up. Otherwise, a refueling fee will be applied.',
      },
      {
        question: 'Can I Book Car Or Bike Under 20 Of Age?',
        answer:
          'The minimum age for renting a car is 21 with a valid license. For bikes, you must be at least 18. Young driver fees may apply for drivers under 25.',
      },
      {
        question: 'How Can I Apply For Promo Code?',
        answer:
          'Enter your promo code during checkout in the designated field. The discount will be applied automatically before you confirm your payment.',
      },
    ],
  },

  {
    title: 'Payment',
    items: [
      {
        question: 'When Will I Be Charged For My Booking?',
        answer:
          'You will be charged at the time of booking confirmation. For long-term rentals, a deposit may be required upfront with the remaining balance due at pickup.',
      },
      {
        question: 'Can I Pay Later?',
        answer:
          'Currently, full payment is required at the time of booking. However, we offer installment options through select payment providers like Klarna and Afterpay.',
      },
      {
        question: 'Do You Offer Refunds?',
        answer:
          'Refunds depend on the cancellation policy and timing of your request. Most bookings are fully refundable if canceled at least 24 hours before pickup.',
      },
      {
        question: 'Are There Any Additional Charges?',
        answer:
          'Additional charges may apply for extra time (late returns), damages, cleaning fees, or optional services like GPS or child seats.',
      },
      {
        question: 'Is My Payment Information Stored?',
        answer:
          'We do not store sensitive payment details on our servers. All transactions are handled by secure third-party payment processors.',
      },
    ],
  },

  {
    title: 'Others',
    items: [
      {
        question: 'Can I Contact Support Anytime?',
        answer:
          "Yes, our customer support team is available 24/7 via live chat, email, and phone. We're always here to help with any questions or issues.",
      },
      {
        question: 'Do You Offer Discounts For Long-Term Rentals?',
        answer:
          'Yes, we offer special rates for weekly and monthly rentals. The longer you rent, the more you save. Check our pricing page for current offers.',
      },
      {
        question: 'What Happens If The Vehicle Breaks Down?',
        answer:
          "Contact support immediately. We will arrange roadside assistance or a replacement vehicle if needed. You won't be charged for downtime caused by mechanical issues.",
      },
      {
        question: 'Can I Choose A Specific Vehicle Model?',
        answer:
          'You can select from available vehicle categories (e.g., compact, SUV, luxury). Specific models are subject to availability but we do our best to accommodate requests.',
      },
      {
        question: 'Do You Offer Insurance?',
        answer:
          'Yes, we offer various insurance options during checkout including collision damage waiver, theft protection, and liability coverage. Choose what fits your needs.',
      },
    ],
  },
];
