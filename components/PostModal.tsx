import { ComponentType } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

type PostModalProps = {
  actionLabel: 'Create' | 'Edit';
  content?: string;
  mutateFn: (data: FormData) => Promise<void>;
  children?: React.ReactNode;
  ModalTrigger?: ComponentType;
};

export default function PostModal({
  actionLabel,
  content,
  mutateFn,
  children,
  ModalTrigger,
}: PostModalProps) {
  return (
    <Dialog>
      {children}
      {ModalTrigger && (
        <DialogTrigger asChild>
          <ModalTrigger />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{actionLabel} post</DialogTitle>
        </DialogHeader>
        <form action={mutateFn}>
          <div className="flex flex-col gap-4">
            <Textarea
              name="content"
              defaultValue={content}
              placeholder="What's on your mind?"
            />
            <Button type="submit">Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
