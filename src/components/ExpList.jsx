import React, { useState } from "react";
import { useExpenseContext } from "../context/ExpenseContext";
import UpdateExpenseModal from "./UpdateExpenseModal"; 

const ExpenseList = () => {
  const { expenses, removeExpense } = useExpenseContext();
  const [showModal, setShowModal] = useState(false);
  const [expenseToUpdate, setExpenseToUpdate] = useState(null);

  const handleDelete = (id) => {
    removeExpense(id); // Remove expense from the list
  };

  const handleUpdate = (expense) => {
    setExpenseToUpdate(expense); // Set the expense to update
    setShowModal(true); // Show the modal
  };

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-item p-4 bg-gray-200 rounded shadow mb-4">
          <div className="expense-info">
            <p><strong>Amount:</strong> ${expense.amount}</p>
            <p><strong>Category:</strong> {expense.category}</p>
            <p><strong>Date:</strong> {expense.date}</p>
            <p><strong>Description:</strong> {expense.description}</p>
          </div>
          <div className="expense-actions">
            <button
              onClick={() => handleUpdate(expense)}
              className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(expense.id)}
              className="bg-red-500 text-white py-1 px-3 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <UpdateExpenseModal
          expense={expenseToUpdate}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default ExpenseList;
