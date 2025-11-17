"use client";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, args) => {
  const result = useQuery(query, args);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true);
    } else {
      try {
        (setData(result), setError(null));
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [result]);
  return {
    data,
    isLoading,
    error,
  };
};

export const useConvexMutation = (mutation) => {
  const mutateFn = useMutation(mutation);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutateFn(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    data,
    isLoading,
    error,
  };
};
