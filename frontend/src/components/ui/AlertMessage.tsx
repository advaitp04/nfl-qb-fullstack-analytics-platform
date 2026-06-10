type Props = {
  message: string;
  tone?: "info" | "warning";
};

function AlertMessage({ message, tone = "info" }: Props) {
  return (
    <p className={`status-message status-message--${tone}`}>{message}</p>
  );
}

export default AlertMessage;
