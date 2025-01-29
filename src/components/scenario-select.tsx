import { useCallback, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "~/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { type CustomScenario } from "@/store/custom-scenario";
import { CustomScenarioDialog } from "./custom-scenario-dialog";

export const defaultScenarios = [
  { id: "spring-festival", label: "春节拜年" },
  { id: "work", label: "回复领导" },
  { id: "customer", label: "回复客户" },
  { id: "social", label: "社交聊天" },
  { id: "social-back", label: "分手挽回" },
  { id: "new", label: "新建场景" },
] as const;

interface ScenarioSelectProps {
  value: string;
  customScenarios: CustomScenario[];
  onValueChange: (value: string) => void;
  onNewScenario: (prompt: string) => void;
  onDeleteScenario: (id: string) => void;
}

export function ScenarioSelect({
  value,
  customScenarios,
  onValueChange,
  onNewScenario,
  onDeleteScenario,
}: ScenarioSelectProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 合并默认场景和自定义场景
  const allScenarios = [
    ...defaultScenarios.filter((s) => s.id !== "new"),
    ...customScenarios,
    { ...defaultScenarios.find((s) => s.id === "new")! },
  ];

  // 处理场景选择的回调
  const handleScenarioChange = useCallback(
    (value: string) => {
      const selectedScenario = allScenarios.find((s) => s.label === value);
      if (!selectedScenario) return;

      if (selectedScenario.id === "new") {
        setIsDialogOpen(true);
      } else {
        onValueChange(value);
        toast({
          title: `已选择${selectedScenario.label}场景`,
          duration: 2000,
        });
      }
    },
    [allScenarios, onValueChange, toast],
  );

  return (
    <>
      <Select value={value} onValueChange={handleScenarioChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择对话场景" />
        </SelectTrigger>
        <SelectContent>
          {allScenarios.map((scenario) =>
            scenario.id === "new" ? (
              <div key={scenario.id}>
                <SelectSeparator className="my-2" />
                <SelectItem
                  value={scenario.label}
                  className="text-muted-foreground"
                >
                  {scenario.label}
                </SelectItem>
              </div>
            ) : (
              <div key={scenario.id} className="relative">
                <SelectItem
                  value={scenario.label}
                  className={
                    scenario.id.startsWith("custom_")
                      ? "text-primary pr-8"
                      : ""
                  }
                >
                  {scenario.label}
                </SelectItem>
                {scenario.id.startsWith("custom_") && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteScenario(scenario.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除场景
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            )
          )}
        </SelectContent>
      </Select>

      {/* Custom Scenario Dialog */}
      <CustomScenarioDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValue=""
        onSave={(prompt) => {
          onNewScenario(prompt);
          toast({
            title: "场景已保存",
            description: "新场景已添加到列表中",
            duration: 2000,
          });
        }}
      />
    </>
  );
}
