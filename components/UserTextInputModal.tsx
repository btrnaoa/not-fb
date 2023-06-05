import Image from 'next/image';
import TextInputModal from './TextInputModal';
import { Button } from './ui/button';

type UserTextInputModalProps = {
  userImage: string;
  title: string;
  placeholder: string;
  buttonLabel: string;
  mutateFn: (data: FormData) => Promise<void>;
};

type UserTextInputModalTriggerProps = {
  buttonLabel: string;
};

function UserTextModalTrigger({ buttonLabel }: UserTextInputModalTriggerProps) {
  return (
    <Button
      variant="ghost"
      className="justify-start flex-grow rounded-full text-muted-foreground bg-muted"
    >
      {buttonLabel}
    </Button>
  );
}

export default function UserTextInputModal({
  userImage,
  title,
  placeholder,
  buttonLabel,
  mutateFn,
}: UserTextInputModalProps) {
  return (
    <div className="flex w-full h-10 gap-2 px-2 mx-auto sm:px-0 sm:max-w-prose">
      <Image
        className="w-10 rounded-full"
        src={userImage}
        width={40}
        height={40}
        alt="user avatar"
      />
      <TextInputModal
        title={title}
        contentPlaceholder={placeholder}
        buttonLabel={buttonLabel}
        mutateFn={mutateFn}
        modalTrigger={<UserTextModalTrigger buttonLabel={placeholder} />}
      />
    </div>
  );
}
