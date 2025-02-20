import Header, { visitorLinks } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HyperLink from "@/components/ui/hyperlink";

export default function Login() {
  return (
    <div>
      <Header navLinks={visitorLinks} />
      <div className="flex justify-center">
        <Card className="w-[500px] mt-20">
          <CardHeader>
            <CardTitle className="text-lg">Login</CardTitle>
            <CardDescription>
              Need an account?{" "}
              <HyperLink text="Create an account." url="/signup" />
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}
