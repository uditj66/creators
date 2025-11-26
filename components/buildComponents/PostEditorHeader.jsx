"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "../ui/button";

import {
  ArrowLeft,
  Calendar,
  Loader,
  Loader2,
  Save,
  Send,
  Settings,
} from "lucide-react";
import { Badge } from "../ui/badge";

const PostEditorHeader = ({
  mode,
  initialData,
  isPublishing,
  onSave,
  onPublish,
  onSchedule,
  onSettingsOpen,
  onBack,
}) => {
  const [isPublishingMenuOpen, setisPublishingMenuOpen] = useState(false);

  const isDraft = initialData?.status === "draft";
  const isEdit = mode === "edit";

  return (
    <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b-2 border-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {isDraft && (
            <Badge
              variant={"secondary"}
              className="bg-orange-500/20  text-orange-300 border-orange-500/30"
            >
              Draft
            </Badge>
          )}
        </div>

        {/* Right*/}

        <div className="flex items-center space-x-3">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={onSettingsOpen}
            className="text-slte-400 hover:text-white"
          >
            <Settings className="h-4 w-4 " />
          </Button>
          {!isEdit && (
            <Button
              variant={"ghost"}
              onClick={onSave}
              disabled={isPublishing}
              size={"sm"}
            >
              {isPublishing ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 " />
              )}
            </Button>
          )}

          {isEdit ? (
            <Button
              variant={"primary"}
              size={"sm"}
              disabled={isPublishing}
              onClick={() => {
                onPublish();
                setisPublishingMenuOpen(false);
              }}
            >
              {isPublishing ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 " />
              )}
              Update
            </Button>
          ) : (
            <DropdownMenu
              dir="left"
              open={isPublishingMenuOpen}
              onOpenChange={setisPublishingMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant={"primary"} disabled={isPublishing}>
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Publish
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    onPublish();
                    setisPublishingMenuOpen(false);
                  }}
                >
                  <Send className="h-4 w-4" />
                  Publish Now
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    onSchedule();
                    setisPublishingMenuOpen(false);
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule For Later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default PostEditorHeader;
