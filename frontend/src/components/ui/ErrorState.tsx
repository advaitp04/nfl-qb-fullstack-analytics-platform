type Props = {
  message: string;
};

function ErrorState({ message }: Props) {
  return <p className="status-message status-message--error">{message}</p>;
}

export default ErrorState;
