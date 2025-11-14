import { SetupRoleBackground } from "./components/Background";
import { SetupRoleCard } from "./components/SetupRoleCard";

export function SetupRolePage() {
  return (
    <SetupRoleBackground>
      <SetupRoleCard />
      <div className="text-white text-center lg:text-left p-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Completa tu perfil
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-lg mx-auto lg:mx-0">
          Ayúdanos a conocerte mejor. Completa tu perfil para que podamos
          personalizar tu experiencia.
        </p>
      </div>
    </SetupRoleBackground>
  );
}
