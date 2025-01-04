import { AuthProvider } from "./providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { TaskProvider } from "./context/TaskContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tick-IT",
  description: "Task Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
