"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-primary">StarTraining</CardTitle>
          <CardDescription className="text-foreground/70">
            Únete para preparar tus entrevistas de trabajo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sign Up Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Crear cuenta
            </h2>
            <p className="text-sm text-muted-foreground">
              Regístrate con tu correo o redes sociales para empezar.
            </p>
            <SignUpButton forceRedirectUrl="/setup-role" mode="modal">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Comenzar registro
              </Button>
            </SignUpButton>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Sign In Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Inicia sesión
            </h2>
            <SignInButton forceRedirectUrl="/setup-role" mode="modal">
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Iniciar sesión
              </Button>
            </SignInButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
