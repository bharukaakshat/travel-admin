"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [phone, setPhone] = useState("");

  const fetchDrivers = async () => {
    const snapshot = await getDocs(collection(db, "drivers"));
    setDrivers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const addDriver = async () => {
    if (!name || !carModel) return;

    await addDoc(collection(db, "drivers"), {
      name,
      carModel,
      carNumber,
      phone,
      createdAt: new Date(),
    });

    setName("");
    setCarModel("");
    setCarNumber("");
    setPhone("");

    fetchDrivers();
  };

  const deleteDriver = async (id: string) => {
    await deleteDoc(doc(db, "drivers", id));
    fetchDrivers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Drivers</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Driver Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Car Model"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Car Number"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          onClick={addDriver}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Driver
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th>Car</th>
                <th>Number</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="py-2">{d.name}</td>
                  <td>{d.carModel}</td>
                  <td>{d.carNumber}</td>
                  <td>{d.phone}</td>
                  <td>
                    <button
                      onClick={() => deleteDriver(d.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="font-semibold text-lg">
                {d.name}
              </div>

              <div className="text-sm text-gray-600 mt-1">
                Car: {d.carModel}
              </div>

              <div className="text-sm text-gray-600">
                Number: {d.carNumber}
              </div>

              <div className="text-sm text-gray-600">
                Phone: {d.phone}
              </div>

              <button
                onClick={() => deleteDriver(d.id)}
                className="text-red-500 text-sm mt-3 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
