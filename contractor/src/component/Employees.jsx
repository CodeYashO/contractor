import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserPopup from "./EditUserPopup"; // Ensure this is correctly imported
import { useInvite } from "@/contexts/InviteSentContext"; // Adjust the path as needed

export default function Employees({ userCompanies , searchQuery }) {
  const token = localStorage.getItem("token");
  const [editableUsers, setEditableUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
  // const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [editingUser, setEditingUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null); // Store original user data
  const [isOpen, setIsOpen] = useState(false); // State to control popup visibility
  const [hasChanges, setHasChanges] = useState(false); // State to track if changes are made

  const { inviteSent, setInviteSent } = useInvite(); // Get the context state

  useEffect(() => {
    fetchUsersByCompany(); // Fetch users initially when the component loads
    setInviteSent(false);
  }, [hasChanges, inviteSent]);

  useEffect(() => {
    handleSearch(); // Call handleSearch whenever searchQuery or editableUsers changes
  }, [searchQuery, editableUsers]);

  const fetchUsersByCompany = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/company/66d8743bc662a6193e728ebc`, // Replace with dynamic company ID as needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditableUsers(response.data.users);
      setFilteredUsers(response.data.users); // Initially show all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to generate initials from the first and last name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Handle change in dropdowns and form inputs
  const handleChange = (value, email, field) => {
    const updatedUsers = editableUsers.map((user) =>
      user.email === email ? { ...user, [field]: value } : user
    );
    setEditableUsers(updatedUsers);
  };

  // Save changes to backend
  const saveChanges = async () => {
    setInviteSent(true);

    try {
      await axios.post("http://localhost:5000/api/users/update", {
        email: editingUser.email,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        title: editingUser.title,
        status: editingUser.status,
        role: editingUser.role,
      });
      alert("User details updated successfully.");
      setEditingUser(null);
      setOriginalUser(null);
      setHasChanges(false); // Reset changes state
      setIsOpen(false); // Close the popup after saving
      fetchUsersByCompany(); // Refresh user data after saving changes
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user details.");
    }
  };

  // Edit button click handler
  const handleEditClick = (user) => {
    setEditingUser(user);
    setOriginalUser({ ...user }); // Store the original user data
    setIsOpen(true); // Open the popup when edit is clicked
    setHasChanges(false); // Reset changes state
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => {
      const updatedUser = { ...prev, [name]: value };
      // Compare updated values with original to detect changes
      setHasChanges(
        updatedUser.firstName !== originalUser.firstName ||
          updatedUser.lastName !== originalUser.lastName ||
          updatedUser.title !== originalUser.title ||
          updatedUser.status !== originalUser.status ||
          updatedUser.role !== originalUser.role
      );
      return updatedUser;
    });
  };

  // Handle search input
  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = editableUsers.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredUsers(filtered);
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
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Title
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
                Role
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {filteredUsers.map((person) => (
              <tr key={person.email}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="flex items-center">
                    {/* Avatar with initials */}
                    <div
                      style={{
                        textAlign: "center",
                        height: "30px",
                        width: "30px",
                      }}
                      className="bg-black mx- text-white rounded-full py-1 mx-3"
                    >
                      <div>
                        {getInitials(person.firstName, person.lastName)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {person.firstName || "NA"} {" "} {person.lastName || "NA"}
                      </div>
                      <div className="mt-1 text-gray-500">{person.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div className="text-gray-900">{person.title}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {person.status === "active" ? (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">
                      {person.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-700 ring-red-600/20">
                      {person.status}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {person.role}
                </td>
                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <button
                    onClick={() => handleEditClick(person)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                    <span className="sr-only">, {person.firstName}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the EditUserPopup component */}
      {isOpen && (
        <EditUserPopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentUser={editingUser}
          handleInputChange={handleInputChange}
          saveChanges={saveChanges}
        />
      )}
    </div>
  );
}
