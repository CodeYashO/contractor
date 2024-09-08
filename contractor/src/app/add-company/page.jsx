"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddCompany = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [userEmail, setUserEmail] = useState(""); // State to capture the user's email

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/companies/add-company", {
        name: companyName,
        companyEmail: companyEmail, // Company's email
        address: companyAddress,
        employees: employeesCount,
        userEmail: userEmail, // User's email
      });

      if (response.status === 201) {
        alert("Company added successfully and linked to user!");
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Failed to add company or link to user. Please try again.");
    }
  };

  const handleDashboardHandler = () =>{
    router.push('/dashboard');
  }

  return (
    <div className="bg-[url('/backgrounds/log.jpg')] bg-cover bg-center bg-no-repeat flex flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add Company
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium leading-6 text-gray-900">
                User Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900">
                Company Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyEmail" className="block text-sm font-medium leading-6 text-gray-900">
                Company Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="companyEmail"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium leading-6 text-gray-900">
                Company Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="employeesCount" className="block text-sm font-medium leading-6 text-gray-900">
                Number of Employees
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="employeesCount"
                  value={employeesCount}
                  onChange={(e) => setEmployeesCount(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Company
              </button>
            </div>
          </form>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
            Check Your DashBoard here ? {"  "} 
            <button
              type="button"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
              onClick={handleDashboardHandler}
            >
             Dashboard
            </button>
          </p>
      </div>
    </div>
  );
};

export default AddCompany;
