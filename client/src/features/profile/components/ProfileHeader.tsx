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
  const userAvatar = user?.imageUrl || profile.avatar;
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <Card className="bg-gray-800 border-gray-700 rounded-2xl overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <Avatar className="h-32 w-32 ring-4 ring-purple-500/20">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl">
                {user?.fullName?.split(' ').map(n => n[0]).join('') || profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">
                Activo
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">
              {user?.fullName || profile.name}
            </h1>
            <p className="text-xl text-gray-300 mb-4">{profile.workField}</p>
            
           
            <div className="flex flex-col gap-2 mb-4">
              {userEmail && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userEmail}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Badge variant="secondary" className="bg-gray-700/50 text-white border-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {profile.yearsExperience} años exp.
              </Badge>
              <Badge variant="secondary" className="bg-gray-700/50 text-white border-gray-600">
                <Award className="w-4 h-4 mr-1" />
                {profile.totalInterviews} entrevistas
              </Badge>
              <Badge variant="secondary" className="bg-gray-700/50 text-white border-gray-600">
                <Star className="w-4 h-4 mr-1" />
                {performance.level}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}