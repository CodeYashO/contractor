import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserPopup from "./EditUserPopup"; // Ensure this is correctly imported
import { useInvite } from "@/contexts/InviteSentContext"; // Adjust the path as needed

export default function Sites() {
  const token = localStorage.getItem("token");
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [editingSite, setEditingSite] = useState(null);
  const [originalSite, setOriginalSite] = useState(null); // Store original site data
  const [isOpen, setIsOpen] = useState(false); // State to control popup visibility
  const [hasChanges, setHasChanges] = useState(false); // State to track if changes are made

  const { inviteSent, setInviteSent } = useInvite(); // Get the context state

  useEffect(() => {
    fetchSites(); // Fetch sites initially when the component loads
    setInviteSent(false);
  }, [hasChanges, inviteSent]);

  console.log(sites)

  // Fetch all sites from the backend
  const fetchSites = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/sites`, // Replace with the correct endpoint
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSites(response.data.sites);
      setFilteredSites(response.data.sites); // Initially show all sites
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  // Edit button click handler
  const handleEditClick = (site) => {
    setEditingSite(site);
    setOriginalSite({ ...site }); // Store the original site data
    setIsOpen(true); // Open the popup when edit is clicked
    setHasChanges(false); // Reset changes state
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSite((prev) => {
      const updatedSite = { ...prev, [name]: value };
      // Compare updated values with original to detect changes
      setHasChanges(
        updatedSite.siteName !== originalSite.siteName ||
        updatedSite.status !== originalSite.status ||
        updatedSite.startDate !== originalSite.startDate ||
        updatedSite.deadline !== originalSite.deadline ||
        updatedSite.siteIncharge !== originalSite.siteIncharge
      );
      return updatedSite;
    });
  };

  // Save changes to backend
  const saveChanges = async () => {
    setInviteSent(true);
    
    try {
      await axios.post("http://localhost:5000/api/sites/update", {
        siteId: editingSite._id,
        siteName: editingSite.siteName,
        siteIncharge: editingSite.siteIncharge,
        status: editingSite.status,
        startDate: editingSite.startDate,
        deadline: editingSite.deadline,
      }, {
        headers: { Authorization: `Bearer ${token}` }, // Ensure the request has authorization headers
      });
      alert("Site details updated successfully.");
      setEditingSite(null);
      setOriginalSite(null);
      setHasChanges(false); // Reset changes state
      setIsOpen(false); // Close the popup after saving
      fetchSites(); // Refresh site data after saving changes
    } catch (error) {
      console.error("Error updating site:", error);
      alert("Failed to update site details.");
    }
  };

  return (
    <div className="rounded-md">
      {/* Wrapper with fixed height, full width, and overflow-y-auto for vertical scroll */}
      <div
        className="overflow-y-auto px-6 w-full"
        style={{ maxHeight: "400px" }}
      >
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Site Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Site Incharge
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Start Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Deadline
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSites.map((site) => (
              <tr key={site._id}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900">
                    {site.siteName || "NA"}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {site.siteIncharge ? `${site.siteIncharge.firstName} ${site.siteIncharge.lastName}` : "NA"}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {site.status === "inwork" ? (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/20">
                      {site.status}
                    </span>
                  ) : site.status === "inactive" ? (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-700 ring-red-600/20">
                      {site.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">
                      {site.status}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {new Date(site.startDate).toLocaleDateString() || "NA"}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {new Date(site.deadline).toLocaleDateString() || "NA"}
                </td>
                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <button
                    onClick={() => handleEditClick(site)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                    <span className="sr-only">, {site.siteName}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the EditSitePopup component */}
      {isOpen && (
        <EditUserPopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentSite={editingSite}
          handleInputChange={handleInputChange}
          saveChanges={saveChanges}
        />
      )}
    </div>
  );
}
