// este background y el de auth podrian ser el mismo

export function SetupRoleBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 -translate-x-1/2 transform-gpu blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          />
        </div>
      </div>

      {/* Layout horizontal */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* {Card para mostrar preguntas del usuario} */}
        {children}
      </div>

      {/* Efecto de fondo inferior */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-[calc(100%-13rem)] left-1/2 -translate-x-1/2 transform-gpu blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          />
        </div>
      </div>
    </div>
  );
}
