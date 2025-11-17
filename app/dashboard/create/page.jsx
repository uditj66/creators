"use client";
import PostEditor from "@/components/buildComponents/PostEditor";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BarLoader } from "react-spinners";

const CreatePost = () => {
  const { data: currentUser, isLoading: userLoading } = useConvexQuery(
    api.users.getAuthenticatedUser
  );
  const {
    data: existingDraft,
    isLoading: isDraftLoading,
    error,
  } = useConvexQuery(api.posts.getUserDraft);
  if (isDraftLoading || userLoading) {
    return <BarLoader width={"100%"} color="#D8B4FE" />;
  }

  if (!currentUser?.userName) {
    return (
      <div className="h-80 bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">
            UserName is required
          </h1>
          <p className="text-slate-400 text-lg">
            Set up a username to create and share your posts
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/settings">
              <Button variant="primary" className="cursor-pointer">
                Set Up Username
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <PostEditor initialData={existingDraft} mode={"create"} />
    </>
  );
};

export default CreatePost;
