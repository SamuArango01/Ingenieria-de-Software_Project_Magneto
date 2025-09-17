"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSetupRole } from "../hooks/useSetupRole";

export function SetupRoleCard() {
  const {
    name,
    setName,
    role,
    setRole,
    otherRole,
    setOtherRole,
    experience,
    setExperience,
    handleSubmit,
    user,
  } = useSetupRole();

  return (
    <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 backdrop-blur-sm shadow-2xl mx-auto lg:mx-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">
          Configura tu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!user?.fullName}
              className="bg-gray-900/50 border-gray-700 text-white disabled:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">
              Rol Profesional
            </Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger id="role" className="w-full bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="desarrollador">Desarrollador</SelectItem>
                <SelectItem value="diseñador">Diseñador</SelectItem>
                <SelectItem value="manager">Project Manager</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === "otro" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 animate-out fade-out slide-out-to-top-2 duration-300">
              <Label htmlFor="other-role" className="text-white">
                Especifica tu rol
              </Label>
              <Input
                id="other-role"
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                placeholder="Ej: QA Tester"
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-white">
              Años de Experiencia
            </Label>
            <Input
              id="experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Ej: 5"
              className="bg-gray-900/50 border-gray-700 text-white"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
}
