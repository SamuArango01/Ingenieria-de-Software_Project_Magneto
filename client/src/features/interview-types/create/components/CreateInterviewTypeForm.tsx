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
}

export function CreateInterviewTypeForm({ 
  form, 
  onSubmit, 
  isLoading 
}: CreateInterviewTypeFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Tipo de Entrevista</CardTitle>
            <CardDescription>
              Define un nuevo tipo de entrevista con un prompt personalizado para la IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Tipo de Entrevista</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Entrevista para Devops" {...field} />
                  </FormControl>
                  <FormDescription>
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
                  <FormLabel>Prompt para la IA (Descripción)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Eres un entrevistador experto en DevOps. Haz preguntas sobre CI/CD, Kubernetes y Terraform..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este texto le dirá a la IA cómo debe comportarse.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Tipo de Entrevista'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
