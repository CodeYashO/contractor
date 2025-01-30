"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Dropdown from "./Dropdown"; // Adjust the path as needed

function CreateMachine() {
  const [machineData, setMachineData] = useState({
    name: "",
    machineIncharge: "",
    vehicleClass: "",
    status: "",
    siteId: "",
    average: "",
    maxSpeed: "",
    imeiNo: "", // Added IMEI number field
  });
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [userId, setUserId] = useState(null);
  const [inchargeError, setInchargeError] = useState("");
  const router = useRouter();
  const token = localStorage.getItem("token");

  // console.log(userId);
  // console.log(orgId);
  // console.log(users); 
  console.log(sites);

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
          setUserId(response.data.user._id);
          setOrgId(response.data.user.company[0]);
          fetchUsers(response.data.user.company[0]);
          fetchSites(response.data.user.company[0]);
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

    const fetchSites = async (organizationId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/sites/company/${organizationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSites(response.data.sites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    checkToken();
  }, [router, token]);

  const handleInchargeChange = (e) => {
    const input = e.target.value;
    setMachineData({ ...machineData, machineIncharge: input });

    const matchingUser = users.find(
      (user) => `${user.firstName} ${user.lastName}`.toLowerCase() === input.toLowerCase()
    );

    if (!matchingUser) {
      setInchargeError("User not found in this organization");
    } else {
      setInchargeError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inchargeError) {
      alert("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/machines/create",
        {
          ...machineData,
          orgId,
          createdBy: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Machine created successfully!");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to create machine.");
    }
  };

  const handleStatusChange = (status) => {
    setMachineData({ ...machineData, status });
  };

  const handleVehicleClassChange = (vehicleClass) => {
    setMachineData({ ...machineData, vehicleClass });
  };

  const handleSiteChange = (siteId) => {
    setMachineData({ ...machineData, siteId });
  };

  return (
    <form className="bg-white p-4" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
          Machine Name
        </label>
        <input
          type="text"
          name="name"
          value={machineData.name}
          onChange={(e) => setMachineData({ ...machineData, name: e.target.value })}
          required
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Machine Incharge Field */}
      <div>
        <label htmlFor="machineIncharge" className="block text-sm font-medium leading-6 text-gray-900">
          Machine Incharge
        </label>
        <input
          type="text"
          name="machineIncharge"
          value={machineData.machineIncharge}
          onChange={handleInchargeChange}
          placeholder="Enter Machine Incharge Name"
          required
          className={`mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
            inchargeError ? "ring-red-500" : ""
          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
            inchargeError ? "focus:ring-red-600" : "focus:ring-indigo-600"
          } sm:text-sm`}
        />
        {inchargeError && <p className="text-red-500 text-sm mt-1">{inchargeError}</p>}
      </div>

      {/* IMEI Number Field */}
      <div>
        <label htmlFor="imeiNo" className="block text-sm font-medium leading-6 text-gray-900">
          IMEI Number
        </label>
        <input
          type="text"
          name="imeiNo"
          value={machineData.imeiNo}
          onChange={(e) => setMachineData({ ...machineData, imeiNo: e.target.value })}
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Vehicle Class Field using Dropdown */}
      <div className="w-full">
        <label htmlFor="vehicleClass" className="block text-sm font-medium leading-6 text-gray-900">
          Vehicle Class
        </label>
        <Dropdown
          options={["light", "medium", "heavy"]}
          selectedValue={machineData.vehicleClass || "Select Vehicle Class"}
          onChange={handleVehicleClassChange}
        />
      </div>

      {/* Status Field using Dropdown */}
      <div className="w-full">
        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
          Status
        </label>
        <Dropdown
          options={["active", "inactive", "maintainance"]}
          selectedValue={machineData.status || "Select Status"}
          onChange={handleStatusChange}
        />
      </div>

      {/* Site Field using Dropdown */}
      <div className="w-full">
        <label htmlFor="siteId" className="block text-sm font-medium leading-6 text-gray-900">
          Site
        </label>
        <Dropdown
          options={sites.map(site => site.siteName)}
          selectedValue={machineData.siteId || "Select Site"}
          onChange={handleSiteChange}
        />
      </div>

      {/* Average Field */}
      <div>
        <label htmlFor="average" className="block text-sm font-medium leading-6 text-gray-900">
          Average (km/litre)
        </label>
        <input
          type="number"
          name="average"
          value={machineData.average}
          onChange={(e) => setMachineData({ ...machineData, average: e.target.value })}
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Max Speed Field */}
      <div>
        <label htmlFor="maxSpeed" className="block text-sm font-medium leading-6 text-gray-900">
          Max Speed (km/hr)
        </label>
        <input
          type="number"
          name="maxSpeed"
          value={machineData.maxSpeed}
          onChange={(e) => setMachineData({ ...machineData, maxSpeed: e.target.value })}
          required
          className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {loading ? "Creating..." : "Create Machine"}
      </button>
    </form>
  );
}

export default CreateMachine;
