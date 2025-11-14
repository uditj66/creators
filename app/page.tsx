import React from "react";
import { ModeToggle } from "./(toggle)/page";
import { Button } from "@/components/ui/button";
const page = () => {
  return (
    <>
      <ModeToggle />

      <Button variant={"primary"}>HELLO</Button>
    </>
  );
};

export default page;
