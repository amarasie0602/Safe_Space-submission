const PageHeader = ({ eyebrow, title, description, action }) => (
  <header className="section-page-header">
    <div>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {action && <div className="section-page-action">{action}</div>}
  </header>
);
export default PageHeader;
