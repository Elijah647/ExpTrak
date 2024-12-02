import React, { useState, useEffect } from "react";
import { useExpenseContext } from "../context/ExpContext";

const UpdateExpenseModal = ({ expense, onClose, onSave }) => {
  const { categories } = useExpenseContext();

  // Initialize the state with expense if provided, or set default empty fields
  const [updatedExpense, setUpdatedExpense] = useState(() => {
    return expense ? { ...expense } : { amount: "", category: "", description: "" };
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Reset updatedExpense if expense prop changes (in case of different expense)
  useEffect(() => {
    if (expense) {
      setUpdatedExpense({ ...expense });
    }
  }, [expense]);

  // Handle input change for category, amount, and description
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update expense
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");  // Reset error message

    // Validation checks
    if (!updatedExpense.amount || updatedExpense.amount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }
    if (!updatedExpense.category) {
      setErrorMessage("Please select a category.");
      return;
    }

    // Call onSave to save the updated expense
    onSave(updatedExpense);

    // Close the modal after saving
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Expense</h2>
        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              value={updatedExpense.category || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>Select a category</option>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <option value="" disabled>No categories available</option>
              )}
            </select>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={updatedExpense.amount || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              value={updatedExpense.description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}  // Close modal
              className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpenseModal;
