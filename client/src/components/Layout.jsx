import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportBanner from './SupportBanner';

// Reveal editorial sections once; keep feed entries and forms immediately visible.
const REVEAL_SELECTOR = '.community-invitation, .thread-list-heading, .calm-section';

const Layout = ({ children }) => {
  const pageRef = useRef(null);
  const pathname = useLocation().pathname;
  const isHome = pathname === '/';
  const isAuthScene = pathname === '/login' || pathname === '/register';

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
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar overlay={isHome} />
      {!isHome && !isAuthScene && <SupportBanner />}
      <main id="main-content" tabIndex={-1} className={`page${isHome ? ' page-home' : ''}${isAuthScene ? ' page-auth' : ''}`} ref={pageRef}>{children}</main>
      {!isAuthScene && <Footer />}
    </>
  );
};

export default Layout;
