import React, { useState, useEffect } from "react";
import { useExpenseContext } from "../context/ExpContext";

const AddExpenseForm = () => {
  const { addExpense, updateExpense, expenses, categories } = useExpenseContext();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (editingId) {
      const expenseToEdit = expenses.find((expense) => expense.id === editingId);
      setFormData(expenseToEdit || { amount: "", category: "", date: "", description: "" });
    }
  }, [editingId, expenses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateAmount = (amount) => {
    // Ensure the amount is a valid positive number
    const numericAmount = parseFloat(amount);
    return !isNaN(numericAmount) && numericAmount > 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formData.amount || !formData.category || !formData.date) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate amount field
    if (!validateAmount(formData.amount)) {
      setError("Please enter a valid positive number for the amount.");
      return;
    }

    if (editingId) {
      updateExpense({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      addExpense({
        id: Date.now(),
        ...formData,
      });
    }

    setFormData({ amount: "", category: "", date: "", description: "" });
    setError("");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only positive numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, amount: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-center">{editingId ? "Update Expense" : "Add New Expense"}</h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Amount</label>
        <input
          type="text" // Changed to text for better manual control of input
          name="amount"
          value={formData.amount}
          onChange={handleAmountChange} // Handle amount change manually
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {editingId ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpenseForm;
