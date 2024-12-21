"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react"; // Directly import useSession here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";  
import { TodoSection } from "@/components/TodoSection"

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Handling undefined session case
  if (!session) {
    return (
      <div className="grid place-items-center h-screen bg-black">
        <div className="bg-amber-50 p-10 text-black flex flex-col gap-4 items-center justify-center rounded-lg shadow-lg">
          <h1 className="font-bold">You are not logged in!</h1>
          {/* Optional: Link to login page */}
          <button className="bg-red-800 rounded-xl px-4 py-2" onClick={()=> router.push("/login")}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 h-auto bg-black">
      {/* Sidebar Section */}
      <div className="col-span-2 bg-[#131010] text-white p-6 rounded-lg shadow-lg flex flex-col h-auto justify-start">
        <h1 className="text-2xl font-bold mb-6">User Info</h1>
        
        <div>
          <p className="mb-2"><strong>Name:</strong> <span>{session.user.name}</span></p>
          <p><strong>Email:</strong> <span>{session.user.email}</span></p>
        </div>

        {/* Log Out Button */}
        <button
          className="bg-white text-red-700 hover:bg-red-700 hover:text-white rounded-xl px-6 py-2 mt-6 w-auto absolute bottom-6"
          onClick={() => signOut({ callbackUrl: "/login" })} // Redirect to login after signing out
        >
          Log Out
        </button>
      </div>

      {/* Main Content Section */}
      <div className="col-span-10 p-8">
        {/* Add your main dashboard content here */}
        <h2 className="text-3xl font-bold text-white mb-4"><span>{session.user.name}'s </span>Dashboard</h2>
        
        <div className="grid grid-cols-3 gap-4 p-6 h-auto">
          {/* First TODO Section */}
          {/* <div className="col-span-1 todo bg-black rounded-xl p-4 shadow-lg min-h-screen flex flex-col">
            <div className="info flex justify-between items-center rounded-xl bg-[#F0BB78] bg-opacity-30 p-4 shadow-md border-white">
              <h1 className="text-white font-bold text-xl">TODO's</h1>
              <button className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition duration-300">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            {/* The .todos div should now take the remaining space 
            <div className="todos mt-4 bg-[#543A14] bg-opacity-20 rounded-xl p-4 flex-grow">
              <p className="text-center text-gray-500 ">
                Add your todo's here
              </p>
            </div>
          </div> */}
          <TodoSection/>

          {/* Second TODO Section */}
          <div className="col-span-1 todo bg-black rounded-xl p-4 shadow-lg min-h-screen flex flex-col">
            <div className="info flex justify-between items-center rounded-xl bg-[#F0BB78] bg-opacity-30 p-4 shadow-md border-white">
              <h1 className="text-white font-bold text-xl">In Progress</h1>
              <button className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition duration-300">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            {/* The .todos div should now take the remaining space */}
            <div className="todos mt-4 bg-[#543A14] bg-opacity-20 rounded-xl p-4 flex-grow">
              <p className="text-center text-gray-500 ">
                Add your todo's here
              </p>
            </div>
          </div>

          {/* Third TODO Section */}
          <div className="col-span-1 todo bg-black rounded-xl p-4 shadow-lg min-h-screen flex flex-col">
            <div className="info flex justify-between items-center rounded-xl bg-[#F0BB78] bg-opacity-30 p-4 shadow-md border-white">
              <h1 className="text-white font-bold text-xl">TODO's</h1>
              <button className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition duration-300">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            {/* The .todos div should now take the remaining space */}
            <div className="todos mt-4 bg-[#543A14] bg-opacity-20 rounded-xl p-4 flex-grow">
              <p className="text-center text-gray-500 ">
                Add your todo's here
              </p>
            </div>
          </div>
        </div>



      </div>
    </div>

  );
};

export default Page;
