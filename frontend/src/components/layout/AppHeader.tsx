type Props = {
  title: string;
};

function AppHeader({ title }: Props) {
  return (
    <header className="app-header">
      <div className="app-header__icon" aria-hidden="true">
        NFL
      </div>
      <h1>{title}</h1>
    </header>
  );
}

export default AppHeader;
