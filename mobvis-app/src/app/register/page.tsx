import HyperLink from "@/components/custom/hyperlink";
import RegisterForm from "@/components/page-specific/register/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/card";

export default function Register() {
  return (
    <div>
      <div className="flex justify-center">
        <Card className="w-[500px] mt-20">
          <CardHeader>
            <CardTitle className="text-lg">Create an account</CardTitle>
            <CardDescription>
              Already have an account?{" "}
              <HyperLink url="/login">Log in.</HyperLink>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
