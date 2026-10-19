import { Children, cloneElement, isValidElement } from 'react';
import PageHeader from './PageHeader';

const StaticPage = ({ title, children }) => {
  const sections = [];
  const content = Children.map(children, (child, index) => {
    if (!isValidElement(child) || child.type !== 'h2') return child;
    const id = `section-${index}`;
    sections.push({ id, title: child.props.children });
    return cloneElement(child, { id, tabIndex: -1 });
  });
  return (
    <div className="information-page">
      <PageHeader eyebrow="SAFESPACE / INFORMATION" title={title} />
      <div className="information-layout">
        <article className="static-page">{content}</article>
        {sections.length > 0 && (
          <nav className="page-contents" aria-label="On this page">
            <strong>On this page</strong>
            {sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          </nav>
        )}
      </div>
    </div>
  );
};
export default StaticPage;
