import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { UserIcon, UserGroupIcon, BeakerIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
    const { register, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'patient',
        phone: '',
        address: '',
        niom: '',
        id_card_front: null,
        id_card_back: null,
        laboratory_license: null
    });
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        if (error) setError('');
    };

    return (
        <div className="flex min-h-[calc(100vh-3rem)]">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-[35%] bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-5 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
                <div className="w-full flex flex-col justify-between relative z-10">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-primary text-xl font-bold">M</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Medora</h1>
                                <p className="text-sm text-white/80 font-medium">Healthcare Platform</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-white/90 font-medium leading-relaxed">
                                Join our growing community of healthcare professionals
                            </p>
                            <p className="text-xs text-white/70">Trusted by clinics worldwide</p>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { number: '2k+', label: 'Active Users', sublabel: 'And growing' },
                                { number: '24/7', label: 'Support', sublabel: 'Always online' }
                            ].map((stat) => (
                                <div key={stat.label}
                                    className="bg-white/10 rounded-lg p-3 border border-white/5">
                                    <div className="text-lg font-bold text-white">{stat.number}</div>
                                    <div className="text-xs font-medium text-white/90">{stat.label}</div>
                                    <div className="text-[10px] text-white/60">{stat.sublabel}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-3 py-6 border-y border-white/10">
                        {['Account', 'Info', 'Verify'].map((label, i) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                                    transition-all duration-200 border-2 font-medium
                                    ${step > i + 1 ? 'bg-white border-white text-primary' :
                                        step === i + 1 ? 'border-white text-white' :
                                            'border-white/30 text-white/30'}
                                `}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xs font-medium ${step === i + 1 ? 'text-white' : 'text-white/60'}`}>
                                        Step {i + 1}
                                    </span>
                                    <span className={`text-sm ${step === i + 1 ? 'text-white font-medium' : 'text-white/40'}`}>
                                        {label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-white/90 font-medium">Secure connection</span>
                        </div>
                        <p className="text-xs text-white/70">Protected by industry standard security</p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-[65%] flex flex-col">
                <div className="flex-1 flex flex-col justify-center px-3 sm:px-4 lg:px-8 py-4">
                    <div className="w-full max-w-md mx-auto">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900">Choose your account type</h2>
                                        <p className="mt-2 text-sm text-gray-600">Select the type of account that best fits your needs</p>
                                    </div>

                                    <div className="grid gap-4">
                                        <RoleCard
                                            title="Patient"
                                            description="For individuals seeking healthcare services"
                                            Icon={UserIcon}
                                            features={['Access medical records', 'Book appointments', 'Secure messaging']}
                                            selected={formData.role === 'patient'}
                                            onClick={() => {
                                                handleChange({ target: { name: 'role', value: 'patient' } });
                                                setTimeout(() => setStep(2), 300);
                                            }}
                                        />
                                        <RoleCard
                                            title="Doctor"
                                            description="For healthcare professionals managing patients"
                                            Icon={UserGroupIcon}
                                            features={['Manage patient records', 'Schedule appointments', 'Collaborate with peers']}
                                            selected={formData.role === 'doctor'}
                                            onClick={() => {
                                                handleChange({ target: { name: 'role', value: 'doctor' } });
                                                setTimeout(() => setStep(2), 300);
                                            }}
                                        />
                                        <RoleCard
                                            title="Laboratory"
                                            description="For labs handling medical tests and results"
                                            Icon={BeakerIcon}
                                            features={['Manage test results', 'Collaborate with doctors', 'Secure data storage']}
                                            selected={formData.role === 'laboratory'}
                                            onClick={() => {
                                                handleChange({ target: { name: 'role', value: 'laboratory' } });
                                                setTimeout(() => setStep(2), 300);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            label="Full Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            label="Phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <textarea
                                            name="address"
                                            placeholder="Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-6">Verification Details</h2>
                                    {formData.role === 'doctor' && (
                                        <div className="space-y-4">
                                            <Input
                                                label="NIOM Number"
                                                name="niom"
                                                value={formData.niom}
                                                onChange={handleChange}
                                                required
                                            />
                                            <FileInput
                                                label="ID Card Front"
                                                name="id_card_front"
                                                onChange={handleChange}
                                                required
                                            />
                                            <FileInput
                                                label="ID Card Back"
                                                name="id_card_back"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    )}

                                    {formData.role === 'laboratory' && (
                                        <FileInput
                                            label="Laboratory License"
                                            name="laboratory_license"
                                            onChange={handleChange}
                                            required
                                        />
                                    )}

                                    <Input
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Confirm Password"
                                        name="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
                                        Back
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step + 1)}
                                        className="ml-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        Continue
                                        <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Creating...' : 'Complete Registration'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

const RoleCard = ({ title, description, Icon, features, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`group relative w-full p-3 rounded-lg border transition-all duration-200
            ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
    >
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${selected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
                <h3 className={`text-sm font-medium ${selected ? 'text-primary' : 'text-gray-900'}`}>{title}</h3>
                <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                <ul className="mt-2 space-y-1">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center text-xs text-gray-600">
                            <CheckIcon className="w-3 h-3 mr-1 text-primary/70" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </button>
);

const Input = ({ label, ...props }) => (
    <div className="relative">
        <input
            {...props}
            placeholder=" "
            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 rounded-md border-gray-200
                     border focus:border-primary focus:ring-1 focus:ring-primary
                     peer transition-all"
        />
        <label className="absolute text-xs text-gray-500 duration-150 transform 
                       -translate-y-6 scale-75 top-3 z-10 origin-[0] left-2.5
                       peer-placeholder-shown:scale-100 
                       peer-placeholder-shown:translate-y-0
                       peer-focus:scale-75 
                       peer-focus:-translate-y-6
                       peer-focus:text-primary">
            {label}
        </label>
    </div>
);

const FileInput = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="file"
            accept="image/*"
            {...props}
            className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 
                     file:rounded-md file:border-0 file:text-xs file:font-medium 
                     file:bg-primary file:text-white hover:file:bg-primary/90"
        />
    </div>
);
