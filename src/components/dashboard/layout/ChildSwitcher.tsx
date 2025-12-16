import { BuddyAvatar } from "@/components/chat/BuddyAvatar";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { CreateChildDialog } from "../CreateChildDialog";
import { useSidebar } from "@/components/ui/sidebar";

export function ChildSwitcher() {
  const { children, refreshProfiles } = useChildProfiles();
  const { childId } = useParams();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedChild = children.find((c) => c.id === childId);

  const handleSelectChild = (id: string) => {
    navigate(`/dashboard/insights/${id}`);
  };

  if (state === "collapsed") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
            {selectedChild ? (
              <BuddyAvatar
                avatar={selectedChild.avatar}
                customAvatarUrl={selectedChild.custom_avatar_url}
                avatarLibraryId={selectedChild.use_library_avatar ? selectedChild.avatar_library_id : undefined}
                size="sm"
                className="w-10 h-10"
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Select Child</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {children.map((child) => (
            <DropdownMenuItem
              key={child.id}
              onClick={() => handleSelectChild(child.id)}
              className="flex items-center gap-2"
            >
              <BuddyAvatar
                avatar={child.avatar}
                customAvatarUrl={child.custom_avatar_url}
                avatarLibraryId={child.use_library_avatar ? child.avatar_library_id : undefined}
                size="sm"
                className="w-6 h-6"
              />
              {child.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Child
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-2 px-3"
          >
            <div className="flex items-center gap-3">
              {selectedChild ? (
                <BuddyAvatar
                  avatar={selectedChild.avatar}
                  customAvatarUrl={selectedChild.custom_avatar_url}
                  avatarLibraryId={selectedChild.use_library_avatar ? selectedChild.avatar_library_id : undefined}
                  size="sm"
                  className="w-10 h-10"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {selectedChild?.name || "Select Child"}
                </span>
                {selectedChild && (
                  <span className="text-xs text-muted-foreground">
                    {selectedChild.streak_days} day streak 🔥
                  </span>
                )}
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Select Child</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {children.map((child) => (
            <DropdownMenuItem
              key={child.id}
              onClick={() => handleSelectChild(child.id)}
              className="flex items-center gap-3 py-2"
            >
              <BuddyAvatar
                avatar={child.avatar}
                customAvatarUrl={child.custom_avatar_url}
                avatarLibraryId={child.use_library_avatar ? child.avatar_library_id : undefined}
                size="sm"
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="font-medium">{child.name}</span>
                <span className="text-xs text-muted-foreground">
                  Age {child.age} • {child.streak_days} day streak
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Child Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateChildDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={refreshProfiles}
      />
    </>
  );
}
