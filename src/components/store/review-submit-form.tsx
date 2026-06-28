"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { submitReview } from "@/actions/reviews";
import { StarRatingInput } from "@/components/store/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewSubmitForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm sm:rounded-[2rem] sm:p-6 md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-accent sm:text-sm sm:tracking-[0.24em]">
        Partagez votre experience
      </p>
      <h3 className="mt-2 text-xl font-black sm:text-2xl">Laisser un avis</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Racontez-nous votre experience avec nos produits et notre service.
      </p>

      <form
        ref={formRef}
        className="mt-6 grid gap-4"
        action={(formData) => {
          startTransition(async () => {
            const result = await submitReview(formData);
            if (result.success) {
              formRef.current?.reset();
              router.refresh();
              toast.success(result.message);
              return;
            }
            toast.error(result.error);
          });
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="customerName">Nom</Label>
          <Input
            id="customerName"
            name="customerName"
            placeholder="Ex: Fatima Zahra"
            required
            minLength={2}
            disabled={isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label>Note</Label>
          <StarRatingInput name="rating" disabled={isPending} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Votre avis</Label>
          <Textarea
            id="content"
            name="content"
            rows={4}
            placeholder="Decrivez la qualite, la livraison et votre satisfaction..."
            required
            minLength={8}
            maxLength={500}
            disabled={isPending}
          />
        </div>
        <Button type="submit" variant="accent" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Envoi en cours..." : "Publier mon avis"}
        </Button>
      </form>
    </div>
  );
}
