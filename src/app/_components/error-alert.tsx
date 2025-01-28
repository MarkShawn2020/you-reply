import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ErrorAlertProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorAlert({
  title = '出错了',
  message,
  className,
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
