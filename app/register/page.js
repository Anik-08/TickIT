import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import RegisterForm from "./ResgisterForm";// Move the form logic into a client component

export default async function Register() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard"); // Redirect if user is logged in
  }

  // Render the client-side form if the user is not logged in
  return <RegisterForm />;
}
