"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useInvite } from "@/contexts/InviteSentContext"; // Adjust the path as needed

function Invite() {
  const [inviteData, setInviteData] = useState({
    role: "employee", // default role
    email: "",
    title : "",
    username: "",
    companyId: "",
  });
  const [companies, setCompanies] = useState([]); // State to hold the companies list
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const useremail = localStorage.getItem("useremail");
  const token = localStorage.getItem("token");
  console.log(useremail, token);

  const { setInviteSent } = useInvite(); // Get the context function

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        console.log("No token found!");
        router.push("/login"); // Redirect to login if no token found
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/verify-token",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.valid) {
          localStorage.removeItem("token"); // Remove invalid token
          router.push("/login"); // Redirect to login
          console.log("Invalid token!");
        } else {
          console.log(response.data.user.company);
          const userId = response.data.user._id; // Assume the response has userId
          fetchCompanies(userId);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token"); // Remove invalid token
        router.push("/login"); // Redirect to login
        console.log("Error verifying token!");
      }
    };

    const fetchCompanies = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/companies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        setCompanies(response.data.companies);
        // Set the initial company selection if companies are available
        if (response.data.companies.length > 0) {
          setInviteData((prev) => ({
            ...prev,
            companyId: response.data.companies[0]._id, // Default to the first company
          }));
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    checkToken();
  }, [router]);

  const handleChange = (e) => {
    setInviteData({ ...inviteData, [e.target.name]: e.target.value });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setloading(true);
    setInviteSent(true)
    console.log(inviteData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/invite",
        { inviteData, useremail }
      );
      alert("Invitation sent successfully!");
      setloading(false);
    } catch (error) {
      console.error(error);
      setloading(false);
      alert("Failed to send invitation.");
    }
  };

  return token ? (
  //   <div className="bg-center flex flex-col justify-center sm:px-6 lg:px-8 min-h-screen">
  // <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    // <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
      <form className="bg-white" onSubmit={handleInvite}>
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Role
          </label>
          <select
            required
            name="role"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        {/* Title Field Added */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div className="my-2">
          <label
            htmlFor="companyId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Company
          </label>
          <select
            required
            name="companyId"
            value={inviteData.companyId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          >
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
            "Invite"
          )}
        </button>
      </form>
//      </div>
//   </div>
// </div>
  ) : (
    ""
  );
}

export default Invite;
