import React, { useState, useEffect } from "react";
import { useExpenseContext } from "../context/ExpContext";
import UpdateExpenseModal from "./updateExpMod";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { expenses, removeExpense, addExpense, updateExpense, categories } = useExpenseContext();
  const [showModal, setShowModal] = useState(false); // Show modal for updating
  const [selectedExpense, setSelectedExpense] = useState(null); // The expense to update
  const [loading, setLoading] = useState(false); // Loading state for async actions
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      setError("Please fill in all required fields.");
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

  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);

  // Group expenses by category for summary and chart
  const expenseSummary = expenses.reduce((summary, expense) => {
    const category = expense.category || "Uncategorized";
    summary[category] = (summary[category] || 0) + parseFloat(expense.amount || 0);
    return summary;
  }, {});

  const handleUpdateClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setLoading(true); // Start loading state
    try {
      removeExpense(id);
      setLoading(false); // End loading state
    } catch (error) {
      console.error("Error deleting expense:", error);
      setLoading(false); // End loading state
    }
  };

  // Chart Data
  const chartData = {
    labels: Object.keys(expenseSummary),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(expenseSummary),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Spending by Category" },
    },
  };

  return (
    <div className="text-gray-900 transition-colors duration-300 px-40 py-5">
      <div className="p-2 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-3xl font-semibold mb-4 md:mb-0 text-white">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
        {/* Total Expenses */}
        <div className="bg-green-300 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold">Total Expenses</h3>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>

        {/* Expense Summary */}
        <div className="bg-blue-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Expense Summary</h3>
          {Object.keys(expenseSummary).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(expenseSummary).map(([category, amount]) => (
                <li key={category} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="font-semibold">${amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p><i>No expenses to summarize</i></p>
          )}
        </div>

        {/* Recent Transactions */}
<div className="bg-gray-200 p-4 rounded-lg shadow-lg overflow-hidden">
  <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
  {expenses.length > 0 ? (
    <div className="max-h-32 overflow-y-auto">
      <ul className="space-y-4">
        {expenses.slice(0, 5).map((expense) => (
          <li key={expense.id} className="flex justify-between bg-gray-200 p-2 rounded-lg shadow-lg max-w-[400px] mx-auto">
            <div>
              <h4 className="font-semibold text-sm">{expense.category}</h4>
              <p className="text-xs">{expense.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg">${expense.amount}</p>
              <p className="text-sm">{expense.description}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleUpdateClick(expense)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 text-xs"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(expense.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 text-xs"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p><i>Start Tracking your spending!</i></p>
  )}
</div>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Add Expense (left half of bottom row) */}
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">{editingId ? "Update Expense" : "Add New Expense"}</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
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
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description (Optional)</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
              {editingId ? "Update Expense" : "Add Expense"}
            </button>
          </form>
        </div>

        {/* Expense Chart (right half of bottom row) */}
        <div className="bg-gray-200 p-10 rounded-lg shadow-lg col-span-2">
          <h3 className="text-xl font-semibold mb-2">Expense Breakdown</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {showModal && selectedExpense && (
  <UpdateExpenseModal
    expense={selectedExpense}
    onClose={() => setShowModal(false)}  // Close modal
    onSave={(updatedExpense) => {
      updateExpense(updatedExpense);  // Save the updated expense
      setShowModal(false);  // Close the modal after saving
    }}
  />
)}
    </div>
  );
};

export default Dashboard;
