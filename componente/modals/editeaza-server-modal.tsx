"use client";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useEffect } from "react";

const formSchema = z.object({
  nume: z.string().min(1, {
    message: "Numele serverului este obligatoriu.",
  }),
  imagineUrl: z.string().min(1, {
    message: "Imaginea serverului este obligatorie.",
  }),
});

export const EditServerModal = () => {
  const { isOpen, onClose, tip, data } = useModal();
  const isModalOpen = isOpen && tip === "editeazaServer";
  const { server } = data;
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nume: "",
      imagineUrl: "",
    },
  });

  useEffect(()=>{
    if(server){
      form.setValue("nume", server.nume);
      form.setValue("imagineUrl", server.imagineUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      await axios.patch(`/api/servers/${server?.id}`, {
        nume: values.nume,
        imagineUrl: values.imagineUrl,
      });
      
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
  }

  return (
    <Dialog open= {isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Personalizează-ți serverul!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Oferă serverului tău personalitate cu un nume și o imagine. Poți oricând să le schimbi mai târziu.😊
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField 
                  control={form.control}
                  name="imagineUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload  endpoint="serverImage"
                                      value={field.value}
                                      onChange={field.onChange}/>
                      </FormControl>
                    </FormItem>
                  )}/>
              </div>
              <FormField
                control={form.control}
                name="nume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Nume server
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Scrie numele serverului tău"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Salvează
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};