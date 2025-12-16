import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useGetSpecialities } from "../hooks/queries/use-get-specialities";

export function OnboardingSpecialitiesSidebar() {
  const [query, setQuery] = useState("");

  const { data: specialities, isLoading } = useGetSpecialities({ query });

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  return (
    <div className="lg:col-span-4 space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Especialidades
      </h3>

      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
        />
        <Input
          placeholder="Buscar especialidade..."
          value={query}
          onChange={handleQueryChange}
          className="pl-9 h-10"
        />

        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading && filteredSpecialties.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          filteredSpecialties.map((specialty) => {
            const servicesCount = getServicesCount(specialty.id);
            const selectedCount = getSelectedServicesCount(specialty.id);
            const isActive = activeSpecialtyId === specialty.id;
            const hasSelection = selectedCount > 0;

            return (
              <button
                key={specialty.id}
                onClick={() => handleSpecialtyClick(specialty.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "flex items-center gap-3 group",
                  isActive
                    ? "border-primary bg-primary/5 shadow-md"
                    : hasSelection
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                <span className="text-2xl flex-shrink-0">{specialty.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate transition-colors",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {specialty.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {servicesCount} servicos disponiveis
                  </p>
                </div>
                {hasSelection && (
                  <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {selectedCount}
                  </span>
                )}
              </button>
            );
          })
        )}
        {filteredSpecialties.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma especialidade encontrada
          </p>
        )}
      </div> */}
    </div>
  )
}