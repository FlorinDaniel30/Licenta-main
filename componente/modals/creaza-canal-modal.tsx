"use client";
import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/componente/ui/dialog";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
  FormLabel,
} from "@/componente/ui/form";
import { Input } from "@/componente/ui/input";
import { Button } from "@/componente/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componente/ui/select";
import { CanalTip } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  nume: z
    .string()
    .min(1, {
      message: "Un nume este necesar.",
    })
    .refine((name) => name !== "general", {
      message: 'Numele canalului nu poate fi general"',
    }),
  tip: z.nativeEnum(CanalTip),
});

export const CreazaCanalModal = () => {
  const params = useParams();
  const { isOpen, onClose, tip, data } = useModal();
  const isModalOpen = isOpen && tip === "creazaCanal";
  const { canalTip } = data;
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nume: "",
      tip: canalTip || CanalTip.TEXT,
    },
  });

  useEffect(() => {
    if (canalTip) {
      form.setValue("tip", canalTip);
    } else {
      form.setValue("tip", CanalTip.TEXT);
    }
  }, [canalTip, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/canale",
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Crează un Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="nume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Nume Canal
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Scrie numele channel-ului"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipul Canalului</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CanalTip).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Crează
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
