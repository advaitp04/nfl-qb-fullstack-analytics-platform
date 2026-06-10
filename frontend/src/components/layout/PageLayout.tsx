import type { ReactNode } from "react";

type Props = {
  header: ReactNode;
  main: ReactNode;
  sidebar: ReactNode;
};

function PageLayout({ header, main, sidebar }: Props) {
  return (
    <div className="app-shell">
      {header}
      <div className="app-grid">
        <div className="app-grid__main">{main}</div>
        <aside className="app-grid__sidebar">{sidebar}</aside>
      </div>
    </div>
  );
}

export default PageLayout;
