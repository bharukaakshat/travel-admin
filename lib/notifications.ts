import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const requestNotificationPermission = async (email: string) => {
  try {
    if (!messaging) return;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: "BMSQzLeCpYbThlALLCgXfg7QlddTDtVdpVPDp2WPz2GcOVmOg8xWjrdRdCdROHhk0pQs9CxX2DqJZkdxF8uO-j8",

    });

    if (!token) return;

    await addDoc(collection(db, "adminTokens"), {
      token,
      email,
      createdAt: new Date(),
    });

  } catch (error) {
    console.log("Notification error:", error);
  }
};