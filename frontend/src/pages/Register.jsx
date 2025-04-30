/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import {
    UserIcon,
    UserGroupIcon,
    IdentificationIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    LockClosedIcon,
    DocumentTextIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
    const { register, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "patient",
        phone: "",
        address: "",
        niom: "",
        id_card_front: null,
        id_card_back: null,
    });
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register(formData);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
        if (error) setError("");
    };

    const FileInput = ({ label, name, onChange, required }) => {
        const [preview, setPreview] = useState(null);

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
            onChange(e);
        };

        const handleRemove = () => {
            setPreview(null);
            setFormData(prev => ({ ...prev, [name]: null }));
        };

        return (
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                {preview || formData[name] ? (
                    <div className="mt-1 relative">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex items-center bg-white dark:bg-gray-800">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                                <img
                                    src={preview || URL.createObjectURL(formData[name])}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {formData[name]?.name || 'Uploaded file'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(formData[name]?.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-1 flex items-center">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 2MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                name={name}
                                onChange={handleFileChange}
                                accept="image/*"
                                required={required}
                            />
                        </label>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Medora Health</h1>
                    <p className="text-emerald-100">Doctor appointment management system</p>
                </div>

                {/* Progress Steps */}
                <div className="px-8 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                        {["Account Type", "Personal Info", "Verification"].map((label, i) => (
                            <div key={label} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                    ${step > i + 1 ? "bg-green-500 text-white" :
                                        step === i + 1 ? "bg-emerald-600 text-white" :
                                            "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
                                >
                                    {step > i + 1 ? <CheckIcon className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`text-xs mt-2 ${step >= i + 1 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center border border-red-100 dark:border-red-900/30">
                            <div className="text-red-500 dark:text-red-400 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create your account</h2>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">Select your role to get started</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <RoleCard
                                        title="Patient"
                                        description="Book appointments and manage your health"
                                        Icon={UserIcon}
                                        features={[
                                            "Book doctor appointments",
                                            "Access medical history",
                                            "Secure messaging"
                                        ]}
                                        selected={formData.role === "patient"}
                                        onClick={() => {
                                            handleChange({
                                                target: {
                                                    name: "role",
                                                    value: "patient",
                                                },
                                            });
                                            setTimeout(() => setStep(2), 300);
                                        }}
                                    />
                                    <RoleCard
                                        title="Doctor"
                                        description="Manage your practice and appointments"
                                        Icon={UserGroupIcon}
                                        features={[
                                            "Manage patient appointments",
                                            "Access patient records",
                                            "Online consultations"
                                        ]}
                                        selected={formData.role === "doctor"}
                                        onClick={() => {
                                            handleChange({
                                                target: {
                                                    name: "role",
                                                    value: "doctor",
                                                },
                                            });
                                            setTimeout(() => setStep(2), 300);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        Icon={IdentificationIcon}
                                    />
                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        Icon={EnvelopeIcon}
                                    />
                                    <InputField
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        Icon={PhoneIcon}
                                    />
                                    <InputField
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        Icon={MapPinIcon}
                                        textarea
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Security</h2>

                                {formData.role === "doctor" && (
                                    <div className="space-y-4">
                                        <InputField
                                            label="Professional License (NIOM)"
                                            name="niom"
                                            value={formData.niom}
                                            onChange={handleChange}
                                            required
                                            Icon={DocumentTextIcon}
                                        />
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FileInput
                                                label="ID Card (Front)"
                                                name="id_card_front"
                                                onChange={handleChange}
                                                required
                                            />
                                            <FileInput
                                                label="ID Card (Back)"
                                                name="id_card_back"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        Icon={LockClosedIcon}
                                    />
                                    <InputField
                                        label="Confirm Password"
                                        name="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        Icon={LockClosedIcon}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                >
                                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                                    Back
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="ml-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
                                >
                                    Continue
                                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="ml-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-70 flex items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : "Complete Registration"}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium">
                            Sign in
                        </Link>
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
        className={`p-4 rounded-lg border transition-all duration-200 text-left
            ${selected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
    >
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selected ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className={`text-lg font-medium ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                <ul className="mt-3 space-y-2">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CheckIcon className={`w-4 h-4 mr-2 ${selected ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`} />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </button>
);

const InputField = ({ label, Icon, textarea = false, ...props }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Icon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            {label}
        </label>
        {textarea ? (
            <textarea
                {...props}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                    focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
            />
        ) : (
            <input
                {...props}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                    focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
        )}
    </div>
);