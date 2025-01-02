import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const adminCards = [
    {
      title: "Manage Companies",
      description:
        "Add, edit, or remove companies and their contact information",
      path: "/admin/companies",
      icon: (
        <svg
          className="w-8 h-8 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      title: "Communication Methods",
      description:
        "Configure and customize communication channels and preferences",
      path: "/admin/communication-methods",
      icon: (
        <svg
          className="w-8 h-8 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-tl from-teal-100 to-blue-200 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminCards.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-teal-600/0 group-hover:from-teal-600/10 transition-all duration-300 rounded-3xl"></div>
              <div className="relative p-8 flex items-start space-x-5">
                <div className="bg-teal-50 rounded-xl p-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-700">{card.description}</p>
                </div>
                <div className="self-center transform group-hover:translate-x-2 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
