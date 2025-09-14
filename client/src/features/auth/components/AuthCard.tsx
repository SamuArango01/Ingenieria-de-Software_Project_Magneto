import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function AuthCard() {
  return (
    <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 backdrop-blur-sm shadow-2xl mx-auto lg:mx-0">
      <SignedOut>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">
            Bienvenido
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Accede a tu cuenta o crea una nueva
          </p>
        </CardHeader>

        <CardContent className="px-6">
          {/* Sección: ¿Ya tienes cuenta? */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                ¿Ya tienes cuenta?
              </h3>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Iniciar Sesión
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Separador */}
          <div className="relative my-8">
            <Separator className="bg-gray-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-800 px-3 text-sm text-gray-400">o</span>
            </div>
          </div>

          {/* Sección: Crear cuenta */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                ¿Primera vez aquí?
              </h3>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Crear Cuenta
                </button>
              </SignUpButton>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-center pt-4">
          <p className="text-xs text-gray-500 w-full">
            Al continuar, aceptas nuestros{" "}
            <a
            // {pendiente el redirect o no agregarlo}
              href="#"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              términos y condiciones
            </a>
          </p>
        </CardFooter>
      </SignedOut>

      <SignedIn>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">
            ¡Hola de nuevo!
          </CardTitle>
          <p className="text-gray-400 text-sm">Ya tienes una sesión activa</p>
        </CardHeader>

        <CardContent className="px-6 text-center">
          <div className="flex flex-col items-center space-y-6">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-16 h-16",
                  userButtonPopoverCard: "bg-gray-800 border-gray-700",
                  userButtonPopoverText: "text-white",
                },
              }}
            />
            <div className="text-center">
              <p className="text-white font-medium mb-2">
                Sesión iniciada correctamente
              </p>
              <p className="text-gray-400 text-sm">
                Usa el menú superior para gestionar tu cuenta
              </p>
            </div>
          </div>
        </CardContent>
      </SignedIn>
    </Card>
  );
}
