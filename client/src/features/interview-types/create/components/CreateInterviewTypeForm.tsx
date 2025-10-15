'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { CreateInterviewTypeValues } from '../schema';

interface CreateInterviewTypeFormProps {
  form: UseFormReturn<CreateInterviewTypeValues>;
  onSubmit: (values: CreateInterviewTypeValues) => void;
  isLoading: boolean;
  isEditMode?: boolean;
}

export function CreateInterviewTypeForm({
  form,
  onSubmit,
  isLoading,
  isEditMode = false
}: CreateInterviewTypeFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <Card className="w-full max-w-2xl bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {isEditMode ? 'Editar Tipo de Entrevista' : 'Crear Nuevo Tipo de Entrevista'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isEditMode
                ? 'Modifica los detalles del tipo de entrevista.'
                : 'Define un nuevo tipo de entrevista con un prompt personalizado para la IA.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Nombre del Tipo de Entrevista</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-gray-700 text-white border-gray-600 placeholder-gray-900"
                      placeholder="Ej: Entrevista para Devops" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Un nombre corto y descriptivo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Prompt para la IA (Descripción)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-gray-700 text-white border-gray-600 placeholder-gray-900"
                      placeholder="Ej: Eres un entrevistador técnico experto en arquitectura de software. Haz preguntas profundas sobre patrones de diseño, microservicios y escalabilidad..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Este texto le dirá a la IA cómo debe comportarse.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Alert className="mt-4 bg-blue-950 text-blue-200 border-blue-700">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertTitle>Visibilidad</AlertTitle>
              <AlertDescription>
                Los tipos de entrevista que crees aquí serán privados y solo visibles para ti.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700">
              {isLoading
                ? (isEditMode ? 'Guardando...' : 'Creando...')
                : (isEditMode ? 'Guardar Cambios' : 'Crear Tipo de Entrevista')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
