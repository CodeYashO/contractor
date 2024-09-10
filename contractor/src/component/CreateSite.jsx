"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useInvite } from "@/contexts/InviteSentContext";
import Dropdown from "./Dropdown"; // Adjust the path as needed

function CreateSite() {
  const [siteData, setSiteData] = useState({
    siteName: "",
    startDate: "",
    deadline: "",
    siteIncharge: "",
    status: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [userId , setuserId] = useState(null);
  const [inchargeError, setInchargeError] = useState("");
  const router = useRouter();
  const useremail = localStorage.getItem("useremail");
  const token = localStorage.getItem("token");

  const { setInviteSent } = useInvite();

  console.log(siteData)

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        console.log("No token found!");
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.valid) {
          localStorage.removeItem("token");
          router.push("/login");
          console.log("Invalid token!");
        } else {
          setuserId(response.data.user._id);
          setOrgId(response.data.user.company[0]);
          fetchUsers(response.data.user.company[0]);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        router.push("/login");
        console.log("Error verifying token!");
      }
    };

    const fetchUsers = async (organizationId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/company/${organizationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    checkToken();
  }, [router, token]);

  const handleInchargeChange = (e) => {
    const input = e.target.value;
    setSiteData({ ...siteData, siteIncharge: input });

    const matchingUser = users.find(
      (user) => `${user.firstName} ${user.lastName}`.toLowerCase() === input.toLowerCase()
    );

    if (!matchingUser) {
      setInchargeError("User not found in this organization");
    } else {
      setInchargeError("");
    }
  };

  const handleInvite = async (e) => {
    setInviteSent(true)
    e.preventDefault();

    if (inchargeError) {
      alert("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/sites/create",
        {
          ...siteData,
          orgId,
          createdBy: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Site created successfully!");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to create site.");
    }
  };

  const handleStatusChange = (status) => {
    setSiteData({ ...siteData, status });
  };

  return (
    <form className="bg-white p-4" onSubmit={handleInvite}>
      {/* Site Name Field */}
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium leading-6 text-gray-900">
          Site Name
        </label>
        <input
          type="text"
          name="siteName"
          value={siteData.siteName}
          onChange={(e) => setSiteData({ ...siteData, siteName: e.target.value })}
          required
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Start Date Field */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium leading-6 text-gray-900">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={siteData.startDate}
          onChange={(e) => setSiteData({ ...siteData, startDate: e.target.value })}
          required
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Deadline Field */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={siteData.deadline}
          onChange={(e) => setSiteData({ ...siteData, deadline: e.target.value })}
          required
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Site Incharge Field */}
      <div>
        <label htmlFor="siteIncharge" className="block text-sm font-medium leading-6 text-gray-900">
          Site Incharge
        </label>
        <input
          type="text"
          name="siteIncharge"
          value={siteData.siteIncharge}
          onChange={handleInchargeChange}
          placeholder="Enter Site Incharge Name"
          required
          className={`mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
            inchargeError ? "ring-red-500" : ""
          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
            inchargeError ? "focus:ring-red-600" : "focus:ring-indigo-600"
          } sm:text-sm`}
        />
        {inchargeError && <p className="text-red-500 text-sm mt-1">{inchargeError}</p>}
      </div>

      {/* Status Field using Dropdown */}
      <div className="w-full">
        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
          Status
        </label>
        <Dropdown
          options={["inwork", "inactive", "completed"]}
          selectedValue={siteData.status || "Select Status"}
          onChange={handleStatusChange}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="block w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Site"}
        </button>
      </div>
    </form>
  );
}

export default CreateSite;
