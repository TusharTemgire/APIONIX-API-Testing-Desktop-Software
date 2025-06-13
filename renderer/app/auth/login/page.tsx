import React from "react";

const page = () => {
  return (
    <div className="bg-[#201c1c] w-full h-screen">
      <div className="flex items-center justify-center h-full">
        <div className="bg-[#242222] h-full w-full">
        </div>
        <div className="bg-[#121212] h-full w-full">
            <div className="flex items-center justify-center h-full">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default page;
