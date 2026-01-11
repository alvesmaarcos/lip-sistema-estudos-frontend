import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SuccessModal } from "@/components/ui/success-modal";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { DisciplineColor, getDisciplineTheme } from "@/lib/constants";
import { Discipline } from "@/types/study";
import { cn } from "@/lib/utils";
import { useDisciplines } from "@/contexts/DisciplineContext";
import { DeleteDisciplineDialog } from "@/components/disciplines/DeleteDisciplineDialog";

const AVAILABLE_COLORS: { value: DisciplineColor; label: string }[] = [
  { value: "purple", label: "Roxo" },
  { value: "blue", label: "Azul" },
  { value: "navy", label: "Azul Marinho" },
  { value: "green", label: "Verde" },
  { value: "red", label: "Vermelho" },
  { value: "orange", label: "Laranja" },
  { value: "gray", label: "Cinza" },
];

export default function Disciplinas() {
  const {
    disciplines,
    addDiscipline,
    updateDiscipline,
    deleteDiscipline,
    isLoading,
  } = useDisciplines();
  const [name, setName] = useState("");
  const [color, setColor] = useState<DisciplineColor>("blue");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] = useState<string | null>(
    null
  );

  const resetForm = () => {
    setName("");
    setColor("blue");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateDiscipline(editingId, { name: name.trim(), color });
        setSuccessMessage("Disciplina atualizada com sucesso!");
      } else {
        await addDiscipline({ name: name.trim(), color });
        setSuccessMessage("Disciplina criada com sucesso!");
      }
      resetForm();
      setShowSuccess(true);
    } catch (error) {
      // Erro já tratado no context
    }
  };

  const handleEdit = (discipline: Discipline) => {
    setName(discipline.name);
    setColor(discipline.color as DisciplineColor);
    setEditingId(discipline.id);
  };

  const handleDeleteClick = (id: string) => {
    setDisciplineToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (disciplineToDelete) {
      try {
        await deleteDiscipline(disciplineToDelete);
        setSuccessMessage("Disciplina excluída com sucesso!");
        setShowSuccess(true);
      } catch (error) {
        // Erro já tratado no context
      }
    }
    setDeleteDialogOpen(false);
    setDisciplineToDelete(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <MainLayout title="Gerenciar Disciplinas">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {editingId ? (
                  <Pencil className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {editingId ? "Editar Disciplina" : "Nova Disciplina"}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? "Altere os dados da disciplina selecionada."
                  : "Preencha os campos para criar uma nova disciplina."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Disciplina</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Arquitetura de Software"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Select
                    value={color}
                    onValueChange={(val) => setColor(val as DisciplineColor)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione uma cor" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_COLORS.map((c) => {
                        const theme = getDisciplineTheme(c.value);
                        return (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.hex }}
                              />
                              {c.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "ATUALIZAR" : "SALVAR"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Disciplinas Cadastradas</CardTitle>
              <CardDescription>
                {disciplines.length} disciplina
                {disciplines.length !== 1 ? "s" : ""} registrada
                {disciplines.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {disciplines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma disciplina cadastrada.</p>
                  <p className="text-sm">Crie uma nova disciplina ao lado.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="w-[100px]">Cor</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disciplines.map((discipline) => {
                        const theme = getDisciplineTheme(discipline.color);
                        return (
                          <TableRow key={discipline.id}>
                            <TableCell className="font-medium">
                              <span
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                                  theme.badge
                                )}
                              >
                                {discipline.name}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: theme.hex }}
                                />
                                <span className="text-sm text-muted-foreground capitalize">
                                  {AVAILABLE_COLORS.find(
                                    (c) => c.value === discipline.color
                                  )?.label || discipline.color}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(discipline)}
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteClick(discipline.id)
                                  }
                                  className="text-destructive hover:text-destructive"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <SuccessModal
        open={showSuccess}
        onClose={handleCloseSuccess}
        title="Sucesso!"
        message={successMessage}
      />

      <DeleteDisciplineDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </MainLayout>
  );
}
