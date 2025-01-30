import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserPopup from "./EditUserPopup"; // Ensure this is correctly imported

const Machines = () => {
  const token = localStorage.getItem("token");
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [editingMachine, setEditingMachine] = useState(null);
  const [originalMachine, setOriginalMachine] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMachines();
  }, [hasChanges]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, machines]);

  const fetchMachines = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/machines`, // Replace with your endpoint
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMachines(response.data.machines);
      setFilteredMachines(response.data.machines);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
    return initials;
  };

  const handleChange = (value, id, field) => {
    const updatedMachines = machines.map((machine) =>
      machine._id === id ? { ...machine, [field]: value } : machine
    );
    setMachines(updatedMachines);
  };

  const saveChanges = async () => {
    try {
      await axios.post("http://localhost:5000/api/machines/update", {
        ...editingMachine,
      });
      alert("Machine details updated successfully.");
      setEditingMachine(null);
      setOriginalMachine(null);
      setHasChanges(false);
      setIsOpen(false);
      fetchMachines();
    } catch (error) {
      console.error("Error updating machine:", error);
      alert("Failed to update machine details.");
    }
  };

  const handleEditClick = (machine) => {
    setEditingMachine(machine);
    setOriginalMachine({ ...machine });
    setIsOpen(true);
    setHasChanges(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMachine((prev) => {
      const updatedMachine = { ...prev, [name]: value };
      setHasChanges(
        updatedMachine.name !== originalMachine.name ||
          updatedMachine.vehicleClass !== originalMachine.vehicleClass ||
          updatedMachine.status !== originalMachine.status ||
          updatedMachine.average !== originalMachine.average ||
          updatedMachine.maxSpeed !== originalMachine.maxSpeed
      );
      return updatedMachine;
    });
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = machines.filter((machine) =>
      machine.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredMachines(filtered);
  };

  return (
    <div className="rounded-md">
      <div
        className="overflow-y-auto px-6 w-full"
        style={{ maxHeight: "400px" }}
      >
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                Name
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Vehicle Class
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Average
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Max Speed
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMachines.map((machine) => (
              <tr key={machine._id}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="flex items-center">
                    <div
                      className="bg-black text-white rounded-full py-1 mx-3"
                      style={{
                        textAlign: "center",
                        height: "30px",
                        width: "30px",
                      }}
                    >
                      {getInitials(machine.name)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {machine.name || "NA"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {machine.vehicleClass}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {machine.status === "active" ? (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">
                      {machine.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-700 ring-red-600/20">
                      {machine.status}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {machine.average}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {machine.maxSpeed}
                </td>
                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <button
                    onClick={() => handleEditClick(machine)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                    <span className="sr-only">, {machine.name}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <EditUserPopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentMachine={editingMachine}
          handleInputChange={handleInputChange}
          saveChanges={saveChanges}
        />
      )}
    </div>
  );
};

export default Machines;
