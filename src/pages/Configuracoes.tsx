import { useState, useEffect } from "react";
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
import { ArrowRight, Calendar, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getSettings,
  updateSettings,
  type UserSettings,
} from "@/http/api/settings";

export default function Configuracoes() {
  const [settings, setSettings] = useState<UserSettings>({
    firstRevisionInterval: 1,
    secondRevisionInterval: 7,
    thirdRevisionInterval: 14,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settings);
      toast.success("Configurações salvas!", {
        description:
          "Os novos intervalos serão aplicados aos próximos estudos.",
      });
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Configurações">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Configurações">
      <div className="max-w-4xl space-y-6 animate-fade-in pb-10">
        {/* Card do Algoritmo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personalizar Algoritmo</CardTitle>
            <CardDescription>
              Defina os intervalos de dias para as revisões espaçadas. As
              mudanças afetarão apenas estudos criados após esta alteração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="first"
                    className="text-xs text-muted-foreground"
                  >
                    1ª Revisão
                  </Label>
                  <Input
                    id="first"
                    type="number"
                    min={1}
                    value={settings.firstRevisionInterval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        firstRevisionInterval: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold"
                    disabled={isSaving}
                  />
                </div>
                <span className="text-muted-foreground mt-6">dia(s)</span>
              </div>

              <ArrowRight className="text-muted-foreground mt-6" size={20} />

              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="second"
                    className="text-xs text-muted-foreground"
                  >
                    2ª Revisão
                  </Label>
                  <Input
                    id="second"
                    type="number"
                    min={1}
                    value={settings.secondRevisionInterval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        secondRevisionInterval: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold"
                    disabled={isSaving}
                  />
                </div>
                <span className="text-muted-foreground mt-6">dias</span>
              </div>

              <ArrowRight className="text-muted-foreground mt-6" size={20} />

              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="third"
                    className="text-xs text-muted-foreground"
                  >
                    3ª Revisão
                  </Label>
                  <Input
                    id="third"
                    type="number"
                    min={1}
                    value={settings.thirdRevisionInterval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        thirdRevisionInterval: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold"
                    disabled={isSaving}
                  />
                </div>
                <span className="text-muted-foreground mt-6">dias</span>
              </div>

              <Button
                onClick={handleSave}
                className="ml-auto mt-6"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Nota:</strong> As mudanças nos intervalos afetarão
                apenas os estudos registrados após salvar esta configuração.
                Revisões já criadas manterão seus intervalos originais.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card de Preferências */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferências</CardTitle>
            <CardDescription>
              Configure notificações e integrações.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Calendar size={20} className="text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <Label className="font-medium">Google Calendar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronize suas revisões com o calendário
                  </p>
                </div>
              </div>
              <Button variant="outline">Conectar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-lg text-red-600 flex items-center gap-2">
              <Trash2 size={20} /> Zona de Perigo (Dev Only)
            </CardTitle>
            <CardDescription>
              Utilize estas opções caso encontre inconsistências ou bugs nos
              dados salvos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    "Tem certeza? Isso apagará TODOS os seus estudos e revisões locais."
                  )
                ) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Resetar Todos os Dados (Factory Reset)
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
