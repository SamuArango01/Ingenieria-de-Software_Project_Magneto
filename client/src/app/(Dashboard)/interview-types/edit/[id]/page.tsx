import { EditInterviewType } from '@/features/interview-types/edit/EditInterviewType';

interface EditInterviewTypePageProps {
  params: {
    id: string;
  };
}

// Este es un Server Component que extrae el ID de la URL y lo pasa al Client Component.
export default function EditInterviewTypePage({ params }: EditInterviewTypePageProps) {
  const id = Number(params.id);

  // Validar que el ID sea un número antes de renderizar
  if (isNaN(id)) {
    return <p>ID inválido.</p>;
  }

  return (
    <div className="flex justify-center items-start p-4 md:p-8">
      <EditInterviewType id={id} />
    </div>
  );
}
