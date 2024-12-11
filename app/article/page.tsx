"use client";
import { useSidebar } from "@/components/sidebar/SidebarProvider";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ArticlePage = () => {
  const { isOpen } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <section
      className={`flex items-center justify-center transition-all duration-500 min-h-full p-16 ${
        isOpen ? "ml-[20%] w-[80%]" : "ml-[7%] w-[93%]"
      } h-[100vh]`}
    >
      <div className="max-w-[1200px] w-full h-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between bg-backcontrast shadow-lg px-6 py-4 rounded-md">
          <h2 className="font-semibold text-2xl text-foreground">Articles</h2>
          <button className="bg-white text-backcontrast px-4 py-2 font-semibold rounded-lg  transition">
            + Create Article
          </button>
        </div>

        {/* Table */}
        <div className="bg-backcontrast p-4 w-full rounded-md shadow-lg">
          <table className="w-full text-left bg-backcontrast text-foreground rounded-lg overflow-hidden">
            <thead className="bg-navItemActiveBg">
              <tr>
                <th className="px-4 py-2 text-left">Cod</th>
                <th className="px-4 py-2 text-left">Denumire</th>
                <th className="px-4 py-2 text-left">Data Creării</th>
                <th className="px-4 py-2 text-left">Ultima Actualizare</th>
                <th className="px-4 py-2 text-left">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-hover hover:bg-navItemNonActiveHover transition">
                <td className="px-4 py-2">ART001</td>
                <td className="px-4 py-2">Articol Test 1</td>
                <td className="px-4 py-2">12-12-2024</td>
                <td className="px-4 py-2">13-12-2024</td>
                <td className="px-4 py-2 relative">
                  {/* Dropdown */}
                  <button
                    onClick={toggleDropdown}
                    className="bg-hover text-foreground px-3 py-1 rounded-full hover:bg-navItemNonActiveHover transition"
                  >
                    ...
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-backcontrast shadow-lg rounded-md border border-hover">
                      <ul className="py-1">
                        <li className="flex items-center px-4 py-2 hover:bg-navItemNonActiveHover transition cursor-pointer">
                          <FaEdit className="text-primary mr-2" />
                          <span className="text-foreground">Edit</span>
                        </li>
                        <li className="flex items-center px-4 py-2 hover:bg-navItemNonActiveHover transition cursor-pointer">
                          <FaTrash className="text-red-500 mr-2" />
                          <span className="text-foreground">Delete</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
              {/* Similar rows */}
              <tr className="border-b border-hover hover:bg-navItemNonActiveHover transition">
                <td className="px-4 py-2">ART002</td>
                <td className="px-4 py-2">Articol Test 2</td>
                <td className="px-4 py-2">10-12-2024</td>
                <td className="px-4 py-2">11-12-2024</td>
                <td className="px-4 py-2 relative">
                  {/* Dropdown */}
                  <button
                    onClick={toggleDropdown}
                    className="bg-hover text-foreground px-3 py-1 rounded-full hover:bg-navItemNonActiveHover transition"
                  >
                    ...
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-backcontrast shadow-lg rounded-md border border-hover">
                      <ul className="py-1">
                        <li className="flex items-center px-4 py-2 hover:bg-navItemNonActiveHover transition cursor-pointer">
                          <FaEdit className="text-primary mr-2" />
                          <span className="text-foreground">Edit</span>
                        </li>
                        <li className="flex items-center px-4 py-2 hover:bg-navItemNonActiveHover transition cursor-pointer">
                          <FaTrash className="text-red-500 mr-2" />
                          <span className="text-foreground">Delete</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ArticlePage;
