"use client";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";

import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const SettingsPage = () => {
  const [username, setUsername] = useState("");

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getAuthenticatedUser
  );
  const { mutate: updateUserName, isLoading: isSubmitting } = useConvexMutation(
    api.users.updateUsername
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      toast.error("Username Pattern is Mismatched !!!!");
      return;
    }
    const trimmedUsername = username.replace(/ /g, "");
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      toast.error(
        "Username should be of atleast 3 characters and not more than 20"
      );
      return;
    }

    // 2. Make sure "await" is here
    try {
      await updateUserName({ userName: trimmedUsername });

      // This code will ONLY run if the await succeeds
      setUsername("");
      toast.success("Username Updated Successfully");
    } catch (error) {
      let cleanMessage = "An error occurred"; // Default fallback message

      try {
        const fullMessage = error.message;

        // 1. Get the part AFTER "Uncaught Error: "
        // e.g., "Username is already taken at handler (...)"
        const part1 = fullMessage.split("Uncaught Error: ")[1];

        // 2. Get the part BEFORE " at "
        // e.g., "Username is already taken"
        const part2 = part1.split(" at ")[0];

        // 3. Set the clean message
        cleanMessage = part2;
      } catch (e) {
        // If parsing fails for any reason, just use the error message as-is
        // or a simpler version of it.
        cleanMessage = error.message.split(" at ")[0]; // Simpler fallback
      }

      // 4. Show the final clean message!
      toast.error(cleanMessage);
    }
  };
  if (isLoading) {
    return <BarLoader width={"100%"} color="#D8B4FE" />;
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text-primary">Settings</h1>
        <p className="text-slate-400 mt-2">
          Manage your profiles and account preferences
        </p>
      </div>
      {/* Username Settings */}
      <Card className="card-glass max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            UserName Settings
          </CardTitle>
          <CardDescription>Set You unique username</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Username */}
          <form onSubmit={handleSubmit}>
            <div className=" space-y-2">
              <Label htmlFor="terms"> UserName</Label>
              <Input
                id="username"
                placeholder="Enter Unique Username"
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                value={username}
              />
              {/* Current Username */}
              {currentUser?.userName && (
                <div className="text-sm text-slate-400">
                  Current username:{""}
                  <span className="text-white">@{currentUser?.userName}</span>
                </div>
              )}

              {/* Username Help */}
              <div className="text-xs text-slate-500">
                3-20 characters, letters, numbers, underscores, and hyphens
                only{" "}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  variant={"primary"}
                  disabled={isSubmitting}
                  type="submit"
                  className="cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Username"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
