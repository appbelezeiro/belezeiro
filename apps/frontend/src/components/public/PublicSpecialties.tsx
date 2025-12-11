interface PublicSpecialtiesProps {
  specialties: { id: string; name: string; icon: string }[];
  primaryColor: string;
}

export const PublicSpecialties = ({ specialties, primaryColor }: PublicSpecialtiesProps) => {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Nossas Especialidades
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Profissionais qualificados em diversas áreas
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all text-center"
            >
              <div 
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                {specialty.icon}
              </div>
              <h3 className="font-semibold text-foreground">{specialty.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
