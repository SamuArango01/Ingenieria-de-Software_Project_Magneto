"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, Star, Mail } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface ProfileHeaderProps {
  readonly profile: CandidateProfile;
  readonly performance: {
    readonly level: string;
    readonly color: string;
  };
}

export function ProfileHeader({ profile, performance }: ProfileHeaderProps) {
  const { user } = useUser();

  // Usar la información del usuario de Clerk
  const userAvatar = user?.imageUrl || profile.user.avatar;
  const userEmail = user?.primaryEmailAddress?.emailAddress || profile.user.email;

  // Helper para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <Avatar className="h-36 w-36 ring-4 ring-purple-500/30 shadow-xl">
              <AvatarImage src={userAvatar || undefined} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl font-bold">
                {getInitials(user?.fullName || profile.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-3 -right-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg border-0 font-semibold">
                Activo
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {user?.fullName || profile.user.name}
            </h1>
            <p className="text-xl text-gray-300 mb-6 font-medium">
              {profile.user.customWorkField || profile.user.workField || "Desarrollo de Software"}
            </p>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 w-fit">
                <Mail className="w-5 h-5 text-purple-400" />
                <span className="text-lg">{userEmail}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                {profile.user.yearsOfExperience || 0} años exp.
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 rounded-full">
                <Award className="w-4 h-4 mr-2" />
                {profile.metrics.totalInterviews} entrevistas
              </Badge>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 mr-2" />
                {performance.level}
              </Badge>
              {profile.user.preferredLanguage && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 rounded-full">
                  {profile.user.preferredLanguage}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}