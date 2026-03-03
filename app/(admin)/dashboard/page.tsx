"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [drivers, setDrivers] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [todayTrips, setTodayTrips] = useState(0);
  const [totalAdvance, setTotalAdvance] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const driversSnap = await getDocs(collection(db, "drivers"));
    setDrivers(driversSnap.size);

    const bookingsSnap = await getDocs(collection(db, "bookings"));
    const bookings = bookingsSnap.docs.map((doc) => doc.data());

    const today = new Date().toISOString().split("T")[0];

    let upcomingCount = 0;
    let completedCount = 0;
    let todayCount = 0;
    let advanceSum = 0;
    let pendingSum = 0;

    bookings.forEach((b: any) => {
      if (b.travelDate < today) completedCount++;
      else upcomingCount++;

      if (b.travelDate === today) todayCount++;

      advanceSum += Number(b.advancePaid || 0);
      pendingSum += Number(b.remainingAmount || 0);
    });

    setUpcoming(upcomingCount);
    setCompleted(completedCount);
    setTodayTrips(todayCount);
    setTotalAdvance(advanceSum);
    setTotalPending(pendingSum);
  };

  const Card = ({ title, value }: any) => (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="text-gray-500 text-sm mb-2">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <Card title="Total Drivers" value={drivers} />
        <Card title="Upcoming Bookings" value={upcoming} />
        <Card title="Completed Bookings" value={completed} />
        <Card title="Today's Trips" value={todayTrips} />
        {/* <Card title="Total Advance Collected" value={`₹${totalAdvance}`} /> */}
        {/* <Card title="Total Pending Amount" value={`₹${totalPending}`} /> */}

      </div>

    </div>
  );
}