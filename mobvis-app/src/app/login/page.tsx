import LoginForm from "@/components/page-specific/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/card";
import HyperLink from "@/components/custom/hyperlink";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <div>
      <div className="flex justify-center">
        <Card className="w-[500px] mt-20">
          <CardHeader>
            <CardTitle className="text-lg">Login</CardTitle>
            <CardDescription>
              Need an account?{" "}
              <HyperLink url="/register">Create an account.</HyperLink>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
