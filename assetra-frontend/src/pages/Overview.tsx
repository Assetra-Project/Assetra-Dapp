import { useState } from 'react';
import OnboardingStep from '../components/OnboardingStep';
import ContactStep from '../components/ContactStep';
import SettlementStep from '../components/SettlementStep';
import DocumentsStep from '../components/DocumentsStep';
import TokenizationStep from '../components/TokenizationStep';
import { ChevronRight } from 'lucide-react';

export default function Overview() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    // Personal Details
    userType: 'physical',
    firstName: '',
    middleName: '',
    lastName: '',
    economicSector: '',
    gender: '',
    birthDate: '',
    identifierType: '',
    identifierNumber: '',
    residentStatus: 'resident',
    nationality: '',
    occupation: '',
    kraPin: '',
    nextOfKin: '',
    nextOfKinContact: '',
    taxExempt: false,
    taxExemptExpiry: '',
    nseBroker: '',
    additionalDetails: '',

    // Contact Details
    phone: '',
    alternativePhone: '',
    street: '',
    building: '',
    city: '',
    postalCode: '',

    // Settlement Details
    accountType: 'individual',
    settlementAccount: '',
    settlementAccountTitle: '',
    settlementBank: ''
  });

  const handleNext = () => {
    // Save form data to localStorage before moving to next step
    if (currentStep === 1) {
      localStorage.setItem('userProfile', JSON.stringify(formData));
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Type */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User type
                </label>
                <select
                  value={formData.userType}
                  onChange={(e) => handleFieldChange('userType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="physical">Physical person</option>
                  <option value="legal">Legal entity</option>
                  <option value="signatory">Signatory</option>
                </select>
              </div>

              {/* Name Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleFieldChange('middleName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Economic Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Economic sector <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.economicSector}
                  onChange={(e) => handleFieldChange('economicSector', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Please select an option</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="services">Services</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => handleFieldChange('gender', e.target.value)}
                      className="mr-2 text-gray-900 focus:ring-gray-900"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => handleFieldChange('gender', e.target.value)}
                      className="mr-2 text-gray-900 focus:ring-gray-900"
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Birth Date */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Identifier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identifier <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.identifierType}
                  onChange={(e) => handleFieldChange('identifierType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Please select an option</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="alien_card">Alien Card</option>
                  <option value="huduma">Huduma Number</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identifier Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.identifierNumber}
                  onChange={(e) => handleFieldChange('identifierNumber', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Resident Status */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resident status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="resident_status"
                      value="resident"
                      checked={formData.residentStatus === 'resident'}
                      onChange={(e) => handleFieldChange('residentStatus', e.target.value)}
                      className="mr-2 text-gray-900 focus:ring-gray-900"
                    />
                    Resident
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="resident_status"
                      value="non_resident"
                      checked={formData.residentStatus === 'non_resident'}
                      onChange={(e) => handleFieldChange('residentStatus', e.target.value)}
                      className="mr-2 text-gray-900 focus:ring-gray-900"
                    />
                    Non-resident
                  </label>
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value="Kenya"
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.nationality}
                  onChange={(e) => handleFieldChange('nationality', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Please select an option</option>
                  <option value="kenyan">Kenyan</option>
                  <option value="ugandan">Ugandan</option>
                  <option value="tanzanian">Tanzanian</option>
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleFieldChange('occupation', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* KRA PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KRA PIN (Mandatory for Residents) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.kraPin}
                  onChange={(e) => handleFieldChange('kraPin', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Next of Kin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next of kin
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin}
                  onChange={(e) => handleFieldChange('nextOfKin', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next of kin contact
                </label>
                <input
                  type="text"
                  value={formData.nextOfKinContact}
                  onChange={(e) => handleFieldChange('nextOfKinContact', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Tax Exemption */}
              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.taxExempt}
                    onChange={(e) => handleFieldChange('taxExempt', e.target.checked)}
                    className="mr-2 rounded text-gray-900 focus:ring-gray-900"
                  />
                  Tax exemption
                </label>
              </div>

              {/* Tax Exempt Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax exempt expiration date
                </label>
                <input
                  type="date"
                  value={formData.taxExemptExpiry}
                  onChange={(e) => handleFieldChange('taxExemptExpiry', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* NSE BROKER */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NSE BROKER
                </label>
                <select
                  value={formData.nseBroker}
                  onChange={(e) => handleFieldChange('nseBroker', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="broker1">Broker 1</option>
                  <option value="broker2">Broker 2</option>
                </select>
              </div>

              {/* Additional Details */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional details
                </label>
                <textarea
                  rows={4}
                  value={formData.additionalDetails}
                  onChange={(e) => handleFieldChange('additionalDetails', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        );
      case 2:
        return <ContactStep onNext={handleNext} />;
      case 3:
        return <SettlementStep onNext={handleNext} />;
      case 4:
        return <DocumentsStep onNext={handleNext} />;
      case 5:
        return <TokenizationStep />;
      default:
        return null;
    }
  };

  return (
    <OnboardingStep
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={
        currentStep === 1 ? "Personal Details" :
        currentStep === 2 ? "Contact Information" :
        currentStep === 3 ? "Settlement Details" :
        currentStep === 4 ? "Required Documents" :
        "Create Token"
      }
    >
      {renderStep()}
    </OnboardingStep>
  );
}