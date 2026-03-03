"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);


    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterDriver, setFilterDriver] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [form, setForm] = useState({
        customerName: "",
        phone: "",
        pickup: "",
        drop: "",
        travelDate: "",
        travelTime: "",
        driverId: "",
        totalAmount: "",
        advancePaid: "",
    });

    const remaining =
        Number(form.totalAmount || 0) - Number(form.advancePaid || 0);

    const fetchBookings = async () => {
        const snapshot = await getDocs(collection(db, "bookings"));
        setBookings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    const fetchDrivers = async () => {
        const snapshot = await getDocs(collection(db, "drivers"));
        setDrivers(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })));
    };


    useEffect(() => {
        fetchBookings();
        fetchDrivers();
    }, []);

    const validate = () => {
        if (!form.customerName || !form.phone || !form.travelDate || !form.driverId)
            return "Please fill required fields";

        if (!/^[6-9]\d{9}$/.test(form.phone))
            return "Enter valid 10-digit phone number";

        return "";
    };

    const addBooking = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        if (editingId) {
            // UPDATE MODE
            await updateDoc(doc(db, "bookings", editingId), {
                ...form,
                totalAmount: Number(form.totalAmount),
                advancePaid: Number(form.advancePaid),
                remainingAmount: remaining,
            });

            setEditingId(null);
        } else {
            // ADD MODE (with double booking check)
            const bookingsSnapshot = await getDocs(collection(db, "bookings"));
            const existingBookings = bookingsSnapshot.docs.map((doc) => doc.data());

            const isDriverBooked = existingBookings.some(
                (b: any) =>
                    b.driverId === form.driverId &&
                    b.travelDate === form.travelDate
            );

            if (isDriverBooked) {
                setError("This driver is already booked on selected date.");
                return;
            }

            await addDoc(collection(db, "bookings"), {
                ...form,
                totalAmount: Number(form.totalAmount),
                advancePaid: Number(form.advancePaid),
                remainingAmount: remaining,
                createdAt: new Date(),
            });
        }

        setForm({
            customerName: "",
            phone: "",
            pickup: "",
            drop: "",
            travelDate: "",
            travelTime: "",
            driverId: "",
            totalAmount: "",
            advancePaid: "",
        });

        fetchBookings();
    };

    const deleteBooking = async (id: string) => {
        await deleteDoc(doc(db, "bookings", id));
        fetchBookings();
    };
    const getStatus = (travelDate: string) => {
        const today = new Date().toISOString().split("T")[0];

        if (travelDate < today) return "Completed";
        return "Upcoming";
    };
    const filteredBookings = bookings.filter((b) => {
        const matchesSearch =
            b.customerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate =
            filterDate === "" || b.travelDate === filterDate;

        const matchesDriver =
            filterDriver === "" || b.driverId === filterDriver;

        const matchesStatus =
            filterStatus === "" || getStatus(b.travelDate) === filterStatus;

        return matchesSearch && matchesDate && matchesDriver && matchesStatus;
    });


    return (
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6">

            {/* ===== Title ===== */}
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Bookings
            </h1>

            {/* ================= FORM ================= */}
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 mb-10">

                <h2 className="text-lg font-semibold mb-6">
                    New Booking
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <input
                        className="w-full border rounded-xl text-base px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Customer Name *"
                        value={form.customerName}
                        onChange={(e) =>
                            setForm({ ...form, customerName: e.target.value })
                        }
                    />

                    <input
                        className="w-full border rounded-xl text-base px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Phone Number *"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />

                    <input
                        className="w-full border rounded-xl px-4 text-base py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Pickup Location"
                        value={form.pickup}
                        onChange={(e) =>
                            setForm({ ...form, pickup: e.target.value })
                        }
                    />

                    <input
                        className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Drop Location"
                        value={form.drop}
                        onChange={(e) =>
                            setForm({ ...form, drop: e.target.value })
                        }
                    />

                    <input
                        type="date"
                        className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.travelDate}
                        onChange={(e) =>
                            setForm({ ...form, travelDate: e.target.value })
                        }
                    />

                    <input
                        type="time"
                        className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.travelTime}
                        onChange={(e) =>
                            setForm({ ...form, travelTime: e.target.value })
                        }
                    />
                    <select
                        className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.driverId}
                        onChange={(e) =>
                            setForm({ ...form, driverId: e.target.value })
                        }
                    >
                        <option value="">Select Driver *</option>
                        {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name} - {driver.carModel}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Total Amount"
                        value={form.totalAmount}
                        onChange={(e) =>
                            setForm({ ...form, totalAmount: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Advance Paid"
                        value={form.advancePaid}
                        onChange={(e) =>
                            setForm({ ...form, advancePaid: e.target.value })
                        }
                    />

                </div>

                {/* Remaining */}
                <div className="mt-6 font-medium text-gray-700">
                    Remaining Amount: ₹{remaining}
                </div>

                {error && (
                    <p className="text-red-500 mt-4 text-sm">
                        {error}
                    </p>
                )}

                <button
                    onClick={addBooking}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition w-full md:w-auto"
                >
                    {editingId ? "Update Booking" : "Add Booking"}
                </button>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <select
                    value={filterDriver}
                    onChange={(e) => setFilterDriver(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">All Drivers</option>
                    {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">All Status</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                </select>

            </div>
            {/* ================= BOOKINGS LIST ================= */}
            <div className="space-y-6">

                {filteredBookings.map((b) => (
                    <div
                        key={b.id}
                        className="bg-white rounded-2xl shadow-md p-5 md:p-6 transition hover:shadow-lg"
                    >

                        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                            <div>
                                <div className="font-semibold text-lg">
                                    {b.customerName}
                                </div>

                                <div className="text-sm text-blue-600 mt-1">
                                    Driver: {drivers.find(d => d.id === b.driverId)?.name || "—"}
                                </div>

                                <div className="text-gray-500 text-sm mt-1">
                                    {b.travelDate} • {b.pickup || "—"} → {b.drop || "—"}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm">

                                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                    Advance ₹{b.advancePaid}
                                </span>

                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                    Remaining ₹{b.remainingAmount}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatus(b.travelDate) === "Completed"
                                        ? "bg-gray-200 text-gray-700"
                                        : "bg-blue-100 text-blue-600"
                                        }`}
                                >
                                    {getStatus(b.travelDate)}
                                </span>
                                <button
                                    onClick={() => setDeleteId(b.id)}
                                    className="text-red-500 text-sm font-medium hover:underline ml-4"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingId(b.id);
                                        setForm({
                                            customerName: b.customerName,
                                            phone: b.phone,
                                            pickup: b.pickup,
                                            drop: b.drop,
                                            travelDate: b.travelDate,
                                            travelTime: b.travelTime,
                                            driverId: b.driverId,
                                            totalAmount: b.totalAmount,
                                            advancePaid: b.advancePaid,
                                        });
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    Edit
                                </button>


                            </div>

                        </div>

                    </div>
                ))}

            </div>
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            Delete Booking?
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this booking?
                        </p>

                        <div className="flex justify-end gap-4">

                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-lg w-full border"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    if (deleteId) {
                                        await deleteBooking(deleteId);
                                        setDeleteId(null);
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
