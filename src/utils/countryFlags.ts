export const countryDialCodes: Record<string, string> = {
  '+1': '🇺🇸', // USA
  '+7': '🇷🇺', // Russia
  '+20': '🇪🇬', // Egypt
  '+27': '🇿🇦', // South Africa
  '+30': '🇬🇷', // Greece
  '+31': '🇳🇱', // Netherlands
  '+32': '🇧🇪', // Belgium
  '+33': '🇫🇷', // France
  '+34': '🇪🇸', // Spain
  '+36': '🇭🇺', // Hungary
  '+39': '🇮🇹', // Italy
  '+40': '🇷🇴', // Romania
  '+41': '🇨🇭', // Switzerland
  '+43': '🇦🇹', // Austria
  '+44': '🇬🇧', // UK
  '+45': '🇩🇰', // Denmark
  '+46': '🇸🇪', // Sweden
  '+47': '🇳🇴', // Norway
  '+48': '🇵🇱', // Poland
  '+49': '🇩🇪', // Germany
  '+51': '🇵🇪', // Peru
  '+52': '🇲🇽', // Mexico
  '+53': '🇨🇺', // Cuba
  '+54': '🇦🇷', // Argentina
  '+55': '🇧🇷', // Brazil
  '+56': '🇨🇱', // Chile
  '+57': '🇨🇴', // Colombia
  '+58': '🇻🇪', // Venezuela
  '+60': '🇲🇾', // Malaysia
  '+61': '🇦🇺', // Australia
  '+62': '🇮🇩', // Indonesia
  '+63': '🇵🇭', // Philippines
  '+64': '🇳🇿', // New Zealand
  '+65': '🇸🇬', // Singapore
  '+66': '🇹🇭', // Thailand
  '+81': '🇯🇵', // Japan
  '+82': '🇰🇷', // South Korea
  '+84': '🇻🇳', // Vietnam
  '+86': '🇨🇳', // China
  '+90': '🇹🇷', // Turkey
  '+91': '🇮🇳', // India
  '+92': '🇵🇰', // Pakistan
  '+93': '🇦🇫', // Afghanistan
  '+94': '🇱🇰', // Sri Lanka
  '+95': '🇲🇲', // Myanmar
  '+98': '🇮🇷', // Iran
  '+212': '🇲🇦', // Morocco
  '+213': '🇩🇿', // Algeria
  '+216': '🇹🇳', // Tunisia
  '+218': '🇱🇾', // Libya
  '+220': '🇬🇲', // Gambia
  '+221': '🇸🇳', // Senegal
  '+233': '🇬🇭', // Ghana
  '+234': '🇳🇬', // Nigeria
  '+237': '🇨🇲', // Cameroon
  '+251': '🇪🇹', // Ethiopia
  '+254': '🇰🇪', // Kenya
  '+255': '🇹🇿', // Tanzania
  '+256': '🇺🇬', // Uganda
  '+351': '🇵🇹', // Portugal
  '+352': '🇱🇺', // Luxembourg
  '+353': '🇮🇪', // Ireland
  '+354': '🇮🇸', // Iceland
  '+355': '🇦🇱', // Albania
  '+356': '🇲🇹', // Malta
  '+358': '🇫🇮', // Finland
  '+359': '🇧🇬', // Bulgaria
  '+370': '🇱🇹', // Lithuania
  '+371': '🇱🇻', // Latvia
  '+372': '🇪🇪', // Estonia
  '+373': '🇲🇩', // Moldova
  '+374': '🇦🇲', // Armenia
  '+375': '🇧🇾', // Belarus
  '+378': '🇸🇲', // San Marino
  '+380': '🇺🇦', // Ukraine
  '+381': '🇷🇸', // Serbia
  '+385': '🇭🇷', // Croatia
  '+386': '🇸🇮', // Slovenia
  '+387': '🇧🇦', // Bosnia
  '+389': '🇲🇰', // Macedonia
  '+420': '🇨🇿', // Czech Republic
  '+421': '🇸🇰', // Slovakia
  '+502': '🇬🇹', // Guatemala
  '+503': '🇸🇻', // El Salvador
  '+504': '🇭🇳', // Honduras
  '+505': '🇳🇮', // Nicaragua
  '+506': '🇨🇷', // Costa Rica
  '+507': '🇵🇦', // Panama
  '+591': '🇧🇴', // Bolivia
  '+593': '🇪🇨', // Ecuador
  '+595': '🇵🇾', // Paraguay
  '+598': '🇺🇾', // Uruguay
  '+852': '🇭🇰', // Hong Kong
  '+880': '🇧🇩', // Bangladesh
  '+886': '🇹🇼', // Taiwan
  '+961': '🇱🇧', // Lebanon
  '+962': '🇯🇴', // Jordan
  '+964': '🇮🇶', // Iraq
  '+965': '🇰🇼', // Kuwait
  '+966': '🇸🇦', // Saudi Arabia
  '+971': '🇦🇪', // UAE
  '+972': '🇮🇱', // Israel
  '+974': '🇶🇦', // Qatar
};

// Sort keys by length in descending order to match longest prefixes first
const sortedCodes = Object.keys(countryDialCodes).sort((a, b) => b.length - a.length);

export const getCountryFlag = (phoneNumber: string): string => {
  if (!phoneNumber) return '🌐';

  // Clean the number - remove spaces, parentheses, dashes
  const cleaned = phoneNumber.replace(/[\s\-()]/g, '');

  // Special case for Romanian local format
  if (cleaned.startsWith('07')) {
    return '🇷🇴';
  }

  // Check for the prefix in our sorted list
  const plusNumber = cleaned.startsWith('+') ? cleaned : '+' + cleaned;

  for (const code of sortedCodes) {
    if (plusNumber.startsWith(code)) {
      return countryDialCodes[code];
    }
  }

  // Default fallback if it starts with + but not found
  if (cleaned.startsWith('+')) return '🏳️';

  return '🌐';
};
