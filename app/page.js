import Image from "next/image";

export default function Home() {
  return (
    <div className="relative bg-black w-screen h-screen flex items-center justify-center text-white">
      {/* Background Image or Pattern */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url("https://www.example.com/your-background-image.jpg")' }}></div>

      {/* Content Wrapper */}
      <div className="z-10 text-center p-8">
        {/* Main Heading with Animation */}
        <h1 className="text-5xl font-bold mb-6 animate-shrink-grow">
          Welcome to <span className="text-blue-400">TAMANG</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl mb-8">
          Your own task management system to help you stay organized and productive. Manage your tasks, track your progress, and achieve your goals!
        </p>

        {/* Call to Action (CTA) Buttons */}
        {/* <div className="space-x-4 mt-8">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Register
          </a>
        </div> */}
      </div>

      {/* Positioning the buttons to top-right */}
      <div className="absolute top-4 right-4 z-20 flex space-x-4">
        <a
          href="/login"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Register
        </a>
      </div>
      <footer className="absolute bottom-2 text-center ">
        &copy; Copyright @ TAMANG 2024
      </footer>
    </div>
  );
}
