"use client";

import { Save, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type CommonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  pending?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function UpdateConfirmDialog({
  open,
  onOpenChange,
  entityName,
  pending = false,
  onConfirm,
}: CommonProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Save />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-bold text-primary">
            Confirm update
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to update {entityName}? Review the new
            information before continuing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={() => void onConfirm()}
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Save data-icon="inline-start" />
            )}
            Confirm update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  entityName,
  pending = false,
  onConfirm,
}: CommonProps) {
  const [confirmation, setConfirmation] = useState("");
  const matches = confirmation === entityName;
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setConfirmation("");
        onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="text-destructive">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-bold text-primary">
            Delete {entityName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Type the entity name exactly to
            confirm permanent deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor="delete-confirmation">
            Type “{entityName}”
          </FieldLabel>
          <Input
            id="delete-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={entityName}
            autoComplete="off"
          />
          <FieldDescription>
            The delete button unlocks only when the names match.
          </FieldDescription>
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!matches || pending}
            onClick={() => void onConfirm()}
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Trash2 data-icon="inline-start" />
            )}
            Delete permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
