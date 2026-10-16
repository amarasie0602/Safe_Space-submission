import { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportBanner from './SupportBanner';

const REVEAL_SELECTOR = [
  '.hero',
  '.page-header',
  '.threads-discovery',
  '.thread-list-heading',
  '.daily-affirmation',
  '.composer-teaser',
  '.post-card',
  '.thread-card',
  '.article-card',
  '.counselor-row',
  '.calm-section',
  '.card',
  '.static-page > *',
].map((selector) => `main.page ${selector}`).join(', ');

const Layout = ({ children }) => {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    const footer = document.querySelector('.footer');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!page || reducedMotion.matches || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -2% 0px' });

    const observed = new WeakSet();
    const observeElements = (elements) => {
      elements.forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add('scroll-reveal');
        const siblings = Array.from(element.parentElement?.children || []);
        const order = siblings.indexOf(element);
        element.style.setProperty('--reveal-delay', `${Math.min(order % 4, 3) * 38}ms`);
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          element.classList.add('is-visible');
        } else {
          observer.observe(element);
        }
      });
    };
    const observeContent = () => observeElements(page.querySelectorAll(REVEAL_SELECTOR));

    observeContent();
    page.classList.add('scroll-reveal-ready');
    if (footer) {
      footer.classList.add('scroll-reveal-ready');
      observeElements([footer]);
    }
    const mutationObserver = new MutationObserver(observeContent);
    mutationObserver.observe(page, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      page.classList.remove('scroll-reveal-ready');
      footer?.classList.remove('scroll-reveal-ready', 'scroll-reveal', 'is-visible');
    };
  }, []);

  return (
    <>
      <Navbar />
      <SupportBanner />
      <main className="page" ref={pageRef}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
