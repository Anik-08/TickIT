export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard"], // Adjust to the routes you want to protect
};
