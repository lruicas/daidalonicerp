import { useState } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useRole } from "@/contexts/RoleContext";
import { useMembers } from "@/contexts/MembersContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck, PauseCircle, UserX, UserPlus, Info, RotateCcw, Trash2, Database,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { toast } from "sonner";
import {
  mockActivity, mockModuleUsage, mockVersions, mockBackups,
  ADMIN_ROLES,
  type AccessUser, type BackupEntry,
} from "@/lib/admin-data";

const Admin = () => {
  const { role } = useRole();
  const { members, setMembers, updateMember, deactivateMember, removeMember } = useMembers();

  // Build access users from shared members context
  const users: AccessUser[] = members.map((m) => ({
    id: m.id,
    nombre: `${m.nombre} ${m.apellidos}`,
    correoUpv: m.correoUpv,
    rol: m.estatus === "Coordinador de sección" || m.estatus === "Coordinador de proyecto" || m.estatus === "Miembro" || m.estatus === "Presidente"
      ? m.estatus as AccessUser["rol"]
      : "Miembro" as AccessUser["rol"],
    activo: !m.fechaSalida,
  }));
  const [backups, setBackups] = useState<BackupEntry[]>(mockBackups);
  const [retentionWeeks, setRetentionWeeks] = useState(4);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccessUser["rol"]>("Miembro");
  const [editingUser, setEditingUser] = useState<AccessUser | null>(null);
  const [editRole, setEditRole] = useState<AccessUser["rol"]>("Miembro");

  if (role !== "Presidente") return <Navigate to="/" replace />;

  const toggleActive = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (user.activo) {
      deactivateMember(id);
    } else {
      // Reactivate: clear fechaSalida
      const member = members.find((m) => m.id === id);
      if (member) updateMember({ ...member, fechaSalida: "" });
    }
    toast.success("Estado actualizado");
  };

  const removeUser = (id: string) => {
    removeMember(id);
    toast.success("Acceso eliminado");
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newId = `MBR-${String(members.length + 1).padStart(3, "0")}`;
    const newMember = {
      id: newId, nombre: inviteEmail.split("@")[0], apellidos: "", seccion: "E-Software" as const,
      estatus: inviteRole as any, titulacion: "", centro: "", anioUniversitario: 1,
      telefono: "", correoUpv: inviteEmail, correoPersonal: "",
      cumpleanos: "", tipoId: "DNI/NIF" as const, numeroId: "",
      fechaEntrada: new Date().toISOString().slice(0, 10), fechaSalida: "",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setInviteOpen(false);
    toast.success("Invitación enviada");
  };

  const handleEditRole = () => {
    if (!editingUser) return;
    const member = members.find((m) => m.id === editingUser.id);
    if (member) {
      updateMember({ ...member, estatus: editRole as any });
    }
    setEditingUser(null);
    toast.success("Rol actualizado");
  };

  const handleBackupNow = () => {
    const newBackup: BackupEntry = {
      id: `BK-${String(backups.length + 1).padStart(3, "0")}`,
      fecha: new Date().toLocaleString("es-ES"),
      tamano: "1.2 GB",
      estado: "Completada",
    };
    setBackups((prev) => [newBackup, ...prev]);
    toast.success("Copia de seguridad realizada");
  };

  const handleRestore = (id: string) => {
    toast.success(`Restaurando copia ${id}…`);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups((prev) => prev.filter((b) => b.id !== id));
    toast.success("Copia eliminada");
  };

  // Colors from design tokens
  const turquoise = "hsl(168, 62%, 55%)";
  const orange = "hsl(30, 95%, 62%)";
  const pink = "hsl(340, 82%, 65%)";

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Panel de Administración</h1>

        {/* ── Section 1: Gestión de Accesos ── */}
        <Card className="border-0 shadow-none bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg" style={{ color: turquoise }}>
                <ShieldCheck className="h-5 w-5" style={{ color: turquoise }} />
                Gestión de Accesos
              </CardTitle>
              <Button onClick={() => setInviteOpen(true)} size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" /> Invitar nuevo miembro
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo UPV</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{u.correoUpv}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">{u.rol}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-0 ${u.activo ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {u.activo ? "Activo" : "Pausado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => { setEditingUser(u); setEditRole(u.rol); }}
                          title="Editar rol"
                        >
                          <ShieldCheck className="h-4 w-4" style={{ color: turquoise }} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleActive(u.id)} title={u.activo ? "Pausar" : "Activar"}>
                          <PauseCircle className="h-4 w-4" style={{ color: turquoise }} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeUser(u.id)} title="Eliminar acceso">
                          <UserX className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ── Section 2: Historial de Uso ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-none bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: orange }}>
                Actividad de la plataforma (últimos 30 días)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RTooltip />
                  <Line type="monotone" dataKey="logins" name="Inicios de sesión" stroke={turquoise} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="acciones" name="Acciones" stroke={orange} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: orange }}>
                Módulos más utilizados
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockModuleUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="modulo" type="category" tick={{ fontSize: 11 }} width={90} />
                  <RTooltip />
                  <Bar dataKey="usos" fill={orange} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Section 3: Versiones y Backups ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card className="border-0 shadow-none bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg" style={{ color: pink }}>
                Historial de Versiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l-2 ml-3" style={{ borderColor: pink }}>
                {mockVersions.map((v) => (
                  <li key={v.version} className="mb-6 ml-6">
                    <span
                      className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ backgroundColor: pink }}
                    />
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{v.version}</p>
                        <p className="text-xs text-muted-foreground">{v.fecha}</p>
                        <p className="text-sm text-foreground/80 mt-0.5">{v.descripcion}</p>
                      </div>
                      <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: pink }} />
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Backups */}
          <Card className="border-0 shadow-none bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg" style={{ color: pink }}>
                  Copias de Seguridad
                </CardTitle>
                <Button onClick={handleBackupNow} size="sm" className="gap-2" style={{ backgroundColor: pink, color: "white" }}>
                  <Database className="h-4 w-4" /> Realizar copia ahora
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-sm whitespace-nowrap text-muted-foreground">
                  Mantener copias de las últimas
                </Label>
                <Slider
                  min={1} max={12} step={1}
                  value={[retentionWeeks]}
                  onValueChange={([v]) => setRetentionWeeks(v)}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-20 text-right">{retentionWeeks} semanas</span>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-sm">{b.fecha}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{b.tamano}</TableCell>
                      <TableCell>
                        <Badge className={`border-0 ${b.estado === "Completada" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
                          {b.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleRestore(b.id)} title="Restaurar">
                            <RotateCcw className="h-4 w-4" style={{ color: pink }} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBackup(b.id)} title="Eliminar">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Invite Dialog ── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar nuevo miembro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input placeholder="usuario@upv.es" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Rol inicial</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AccessUser["rol"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ADMIN_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
            <Button onClick={handleInvite}>Enviar invitación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Role Dialog ── */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar rol de {editingUser?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <Label>Nuevo rol</Label>
            <Select value={editRole} onValueChange={(v) => setEditRole(v as AccessUser["rol"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
            <Button onClick={handleEditRole}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Admin;
