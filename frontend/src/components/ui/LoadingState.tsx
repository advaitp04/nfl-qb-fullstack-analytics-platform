type Props = {
  message?: string;
};

function LoadingState({ message = "Loading..." }: Props) {
  return <p className="status-message">{message}</p>;
}

export default LoadingState;
