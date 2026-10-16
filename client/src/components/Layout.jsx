import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportBanner from './SupportBanner';

const REVEAL_SELECTOR = [
  '.hero',
  '.page-header',
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
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pageRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!page || reducedMotion.matches || !('IntersectionObserver' in window)) return undefined;

    let lastScrollY = window.scrollY;
    const observer = new IntersectionObserver((entries) => {
      const scrollY = window.scrollY;
      const direction = scrollY < lastScrollY ? 'up' : 'down';
      lastScrollY = scrollY;

      entries.forEach((entry) => {
        entry.target.dataset.revealDirection = direction;
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    const observed = new WeakSet();
    const observeContent = () => {
      page.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add('scroll-reveal');
        observer.observe(element);
      });
    };

    observeContent();
    page.classList.add('scroll-reveal-ready');
    const mutationObserver = new MutationObserver(observeContent);
    mutationObserver.observe(page, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      page.classList.remove('scroll-reveal-ready');
    };
  }, [pathname]);

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
