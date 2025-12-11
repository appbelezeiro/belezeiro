import { useNavigate } from "react-router-dom";
import { Building2, MapPin, ChevronRight } from "lucide-react";

const mockUnits = [
  {
    id: "1",
    name: "Studio Jardins",
    address: "Rua Oscar Freire, 1234 - Jardins, São Paulo",
    clientsCount: 234,
  },
  {
    id: "2",
    name: "Espaço Moema",
    address: "Av. Moema, 567 - Moema, São Paulo",
    clientsCount: 156,
  },
  {
    id: "3",
    name: "Unidade Pinheiros",
    address: "Rua dos Pinheiros, 890 - Pinheiros, São Paulo",
    clientsCount: 89,
  },
];

const UnitSelection = () => {
  const navigate = useNavigate();

  const handleSelectUnit = (unitId: string) => {
    // TODO: Set selected unit in context
    console.log("Selected unit:", unitId);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="content-container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Belezeiro</h1>
              <p className="text-sm text-muted-foreground">Studio Ana Costa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Greeting */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Olá, Ana! 👋
            </h2>
            <p className="text-lg text-muted-foreground">
              Qual unidade você deseja acessar hoje?
            </p>
          </div>

          {/* Units Grid */}
          <div className="space-y-4">
            {mockUnits.map((unit, index) => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit.id)}
                className="w-full group"
              >
                <div className="bg-card border border-border rounded-2xl p-6 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group-hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {unit.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{unit.address}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium text-foreground">{unit.clientsCount}</span> clientes ativos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Acessar</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Você pode trocar de unidade a qualquer momento no menu
          </p>
        </div>
      </main>
    </div>
  );
};

export default UnitSelection;
