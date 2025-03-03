"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { db } from "../Firebase/config";
import { collection, getDocs } from "firebase/firestore"; // Use modular imports

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const username = prompt("Enter Your Username");
    const password = prompt("Enter Your Password");
    if (username === process.env.NEXT_PUBLIC_Username && password === process.env.NEXT_PUBLIC_Password) {
      setLoggedIn(true);
      const fetchUsers = async () => {
        try {
          const requestsRef = collection(db, 'Requests');
          const requestsSnapshot = await getDocs(requestsRef); 
          const usersList = requestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
      };
      fetchUsers();
    } else {
      alert("Invalid credentials. Redirecting to homepage...");
      router.push("/");
      setLoggedIn(false);
    }
  }, [router]);

  return (
    <div>
      {loggedIn ? (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
            <h1 className="text-center text-gray-600 text-xl font-bold mb-4">Requests</h1>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">MOB</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">New Father</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">New Mother</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Real Father</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Real Mother</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-700">No requests found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.User}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.Mob || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.NewFather || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.NewMother || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.realFather || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.realMother || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </>
      ) : (
        <p className="text-center text-gray-500">Redirecting...</p>
      )}
    </div>
  );
};

export default Admin;
