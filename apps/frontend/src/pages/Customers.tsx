import { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CustomerCard, Customer } from "@/components/customers/CustomerCard";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerDetailSheet } from "@/components/customers/CustomerDetailSheet";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

// Mock customers data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Maria Santos",
    phone: "(11) 99999-1234",
    email: "maria.santos@email.com",
    createdAt: "Jan/2024",
    lastAppointment: "28/11/2024",
    totalAppointments: 15,
    status: "active",
    favoriteTime: "14:00",
    averageFrequencyDays: 21,
  },
  {
    id: "2",
    name: "Ana Oliveira",
    phone: "(11) 98888-5678",
    email: "ana.oliveira@email.com",
    createdAt: "Mar/2024",
    lastAppointment: "25/11/2024",
    totalAppointments: 8,
    status: "active",
    favoriteTime: "10:00",
    averageFrequencyDays: 30,
  },
  {
    id: "3",
    name: "Carlos Lima",
    phone: "(11) 97777-9012",
    email: "carlos.lima@email.com",
    createdAt: "Jun/2023",
    lastAppointment: "20/11/2024",
    totalAppointments: 24,
    status: "active",
    favoriteTime: "16:00",
    averageFrequencyDays: 14,
  },
  {
    id: "4",
    name: "Beatriz Costa",
    phone: "(11) 96666-3456",
    email: "beatriz.costa@email.com",
    createdAt: "Set/2024",
    lastAppointment: "15/11/2024",
    totalAppointments: 3,
    status: "active",
    averageFrequencyDays: 28,
  },
  {
    id: "5",
    name: "Roberto Alves",
    phone: "(11) 95555-7890",
    email: "roberto.alves@email.com",
    createdAt: "Fev/2024",
    lastAppointment: "01/09/2024",
    totalAppointments: 6,
    status: "inactive",
    averageFrequencyDays: 45,
  },
  {
    id: "6",
    name: "Fernanda Souza",
    phone: "(11) 94444-2345",
    email: "fernanda.souza@email.com",
    createdAt: "Nov/2023",
    lastAppointment: "22/11/2024",
    totalAppointments: 18,
    status: "active",
    favoriteTime: "09:00",
    averageFrequencyDays: 18,
  },
  {
    id: "7",
    name: "Lucas Mendes",
    phone: "(11) 93333-6789",
    email: "lucas.mendes@email.com",
    createdAt: "Ago/2024",
    lastAppointment: null,
    totalAppointments: 0,
    status: "active",
  },
  {
    id: "8",
    name: "Juliana Pereira",
    phone: "(11) 92222-0123",
    email: "juliana.pereira@email.com",
    createdAt: "Jul/2024",
    lastAppointment: "10/08/2024",
    totalAppointments: 2,
    status: "inactive",
    averageFrequencyDays: 60,
  },
];

const Customers = () => {
  const { toast } = useToast();
  const { emptyStates } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentsFilter, setAppointmentsFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
    setSelectedCustomer(null);
  };

  const handleClearFilters = () => {
    setAppointmentsFilter("all");
    setPeriodFilter("all");
    setStatusFilter("all");
  };

  const handleAddCustomer = (newCustomer: { name: string; phone: string; email: string }) => {
    const customer: Customer = {
      id: `new-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      createdAt: new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
      lastAppointment: null,
      totalAppointments: 0,
      status: "active",
    };
    setCustomers((prev) => [customer, ...prev]);
    toast({ title: "Cliente adicionado!", description: `${customer.name} foi adicionado com sucesso.` });
  };

  const handleEditCustomer = (id: string) => {
    toast({ title: "Editar cliente", description: "Funcionalidade em desenvolvimento." });
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Cliente removido", variant: "destructive" });
    handleCloseDetailSheet();
  };

  const handleWhatsAppCustomer = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (customer?.phone) {
      const phone = customer.phone.replace(/\D/g, "");
      window.open(`https://wa.me/55${phone}`, "_blank");
    }
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    if (emptyStates.customers) return [];
    
    return customers.filter((customer) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.email.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Appointments filter
      if (appointmentsFilter !== "all") {
        if (appointmentsFilter === "0" && customer.totalAppointments !== 0) return false;
        if (appointmentsFilter === "1-5" && (customer.totalAppointments < 1 || customer.totalAppointments > 5)) return false;
        if (appointmentsFilter === "5+" && customer.totalAppointments <= 5) return false;
      }

      // Status filter
      if (statusFilter !== "all" && customer.status !== statusFilter) return false;

      // Period filter (simplified - in production would use actual dates)
      if (periodFilter === "inactive" && customer.status !== "inactive") return false;

      return true;
    });
  }, [customers, searchQuery, appointmentsFilter, periodFilter, statusFilter, emptyStates.customers]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader activeNav="clientes" />

      <main className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="border-b border-border bg-card/50">
          <div className="content-container py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Clientes
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredCustomers.length} cliente(s) encontrado(s)
                </p>
              </div>
              <AddCustomerDialog onAdd={handleAddCustomer} />
            </div>

            {/* Search */}
            <div className="mt-4 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border bg-background">
          <div className="content-container py-3">
            <CustomerFilters
              appointmentsFilter={appointmentsFilter}
              periodFilter={periodFilter}
              statusFilter={statusFilter}
              onAppointmentsChange={setAppointmentsFilter}
              onPeriodChange={setPeriodFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          <div className="content-container py-4">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou adicione um novo cliente.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onClick={handleCustomerClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Customer Detail Sheet */}
      <CustomerDetailSheet
        customer={selectedCustomer}
        isOpen={isDetailSheetOpen}
        onClose={handleCloseDetailSheet}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onWhatsApp={handleWhatsAppCustomer}
      />
    </div>
  );
};

export default Customers;
