'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

type TextInputModal = {
  title: string;
  initialContent?: string;
  contentPlaceholder?: string;
  buttonLabel: string;
  mutateFn: (data: FormData) => Promise<void>;
  modalTrigger?: React.ReactElement;
  children?: React.ReactNode;
};

export default function TextInputModal({
  title,
  initialContent = '',
  contentPlaceholder = '',
  buttonLabel,
  mutateFn,
  modalTrigger,
  children,
}: TextInputModal) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      {modalTrigger && <DialogTrigger asChild>{modalTrigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <form
          action={async (data) => {
            await mutateFn(data);
            setOpen((prev) => !prev);
          }}
        >
          <div className="flex flex-col gap-4">
            <Textarea
              name="content"
              defaultValue={initialContent}
              placeholder={contentPlaceholder}
            />
            <Button type="submit">{buttonLabel}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
