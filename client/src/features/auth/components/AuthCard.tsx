import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function AuthCard() {
  return (
    <Card className="h-36 w-24 bg-[#04004d]">
      <CardHeader>
        <CardTitle>Inicia sesion facilmente</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
