import { getToken } from "firebase/messaging";
import { messaging, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const requestNotificationPermission = async () => {
  if (!messaging) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const token = await getToken(messaging, {
    vapidKey: "BMSQzLeCpYbThlALLCgXfg7QlddTDtVdpVPdp2WPz2GcOVmOg8xWjrdRdCdROHhkOpQs9CxX2DqJzkdxF8uO-j8",
    
  });

  if (token) {
    await addDoc(collection(db, "adminDevices"), {
      token: token,
      createdAt: new Date(),
    });
  }
};
