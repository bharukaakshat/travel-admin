import "./globals.css";

export const metadata = {
  title: "TravelHub",
  description: "Professional Travel Admin App",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
