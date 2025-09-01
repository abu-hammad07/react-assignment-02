import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        personal: {
            firstName: '',
            lastName: '',
            email: '',
        },
        address: {
            street: '',
            city: '',
            zipCode: '',
        },
        payment: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
        }
    });

    const steps = [
        { id: 1, title: 'Personal Info' },
        { id: 2, title: 'Address' },
        { id: 3, title: 'Payment' },
        { id: 4, title: 'Confirmation' },
    ];

    const handleInputChange = (step: keyof typeof formData, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [step]: {
                ...prev[step],
                [field]: value
            }
        }));
    };

    const nextStep = () => {
        if (step < steps.length) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        nextStep();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl mt-50">
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Portfolio
            </Link>

            <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">Multi-Step Form</h1>

            <div className="bg-white rounded-xl shadow-md p-6">
                {/* Progress Stepper */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {steps.map((s, index) => (
                            <div key={s.id} className="flex items-center">
                                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'w-28' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s.id
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : 'border-gray-300 text-gray-500'
                                        }`}>
                                        {s.id}
                                    </div>
                                    <span className={`text-sm mt-2 ${step >= s.id ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                                        {s.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-grow h-1 mx-2 ${step > s.id ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.personal.firstName}
                                    onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.personal.lastName}
                                    onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.personal.email}
                                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="street">Street Address</label>
                                <input
                                    type="text"
                                    id="street"
                                    value={formData.address.street}
                                    onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    value={formData.address.city}
                                    onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="zipCode">ZIP Code</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    value={formData.address.zipCode}
                                    onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="cardNumber">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={formData.payment.cardNumber}
                                    onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        value={formData.payment.expiryDate}
                                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        value={formData.payment.cvv}
                                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Form Submitted Successfully!</h2>
                            <p className="text-gray-600 mb-6">Thank you for completing the multi-step form.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setFormData({
                                        personal: { firstName: '', lastName: '', email: '' },
                                        address: { street: '', city: '', zipCode: '' },
                                        payment: { cardNumber: '', expiryDate: '', cvv: '' }
                                    });
                                }}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Start New Form
                            </button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    {step < 4 && (
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`px-6 py-2 rounded-lg ${step === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Previous
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MultiStepForm;