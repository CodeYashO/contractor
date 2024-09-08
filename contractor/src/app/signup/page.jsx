"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    country: "",
    state: "",
    city: "",
    contactNumber: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    numberOfEmployees: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    router.push("/login");
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password.length < 6) {
      setLoading(false);
      alert("Password length should be 6 digits or greater.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      alert("Registration successful! Please check your email for OTP.");
      router.push("/verify-otp");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('/backgrounds/log.jpg')] bg-cover bg-center bg-no-repeat flexflex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="px-2 py-2 flex min-h-screen items-center justify-center p-4">
        <div className="px-2 py-2 w-full max-w-4xl rounded-lg p-4 max-h-screen">
          <div className="px-2 py-2 flex justify-center mb-4">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="px-2 py-2 h-10 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register to your account
          </h2>
          <form onSubmit={handleSubmit} className="px-2 py-2 space-y-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div className="px-2 py-2 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 grid grid-cols-1 gap-3">
                  <div>
                    <label
                      htmlFor="state"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-2 py-2 flex w-full justify-center rounded-md bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <>
                <div className="px-2 py-2 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="city"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="age"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 grid grid-cols-1 gap-3">
                  <div>
                    <label
                      htmlFor="password"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="mx-2 px-2 py-2 flex w-full justify-center rounded-md bg-gray-600 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-2 py-2 flex w-full justify-center rounded-md bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Company Details */}
            {currentStep === 3 && (
              <>
                <div className="px-2 py-2 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="companyName"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="companyEmail"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Company Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="companyAddress"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Company Address
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 grid grid-cols-1 gap-3">
                  <div>
                    <label
                      htmlFor="numberOfEmployees"
                      className="px-2 py-2 block text-sm font-medium text-gray-700"
                    >
                      Number of Employees
                    </label>
                    <input
                      type="text"
                      name="numberOfEmployees"
                      onChange={handleChange}
                      className="px-2 py-2 mt-1 block w-full rounded-md border border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="px-2 py-2 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="mx-2 px-2 py-2 flex w-full justify-center rounded-md bg-gray-600 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-2 flex w-full justify-center rounded-md bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleChange}
                    disabled = {loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="px-2 py-2 text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              className="px-2 py-2 font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              onClick={handleClick}
            >
              Login here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
