import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import PageLoading from './components/PageLoading';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import { fadeRise, reducedFade } from './lib/motion';
import PrivateRoute from './context/PrivateRoute';
import AdminRoute from './context/AdminRoute';
import CounselorPrivateRoute from './context/CounselorPrivateRoute';

// Load page code only when its route is visited.
const PostFeed = lazy(() => import('./pages/PostFeed'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const ThreadList = lazy(() => import('./pages/ThreadList'));
const ThreadDetail = lazy(() => import('./pages/ThreadDetail'));
const CreateThread = lazy(() => import('./pages/CreateThread'));
const CounselorList = lazy(() => import('./pages/CounselorList'));
const CounselorProfile = lazy(() => import('./pages/CounselorProfile'));
const Inspiration = lazy(() => import('./pages/Inspiration'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CommunityGuidelines = lazy(() => import('./pages/CommunityGuidelines'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const CrisisResources = lazy(() => import('./pages/CrisisResources'));
const MyActivity = lazy(() => import('./pages/MyActivity'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin, counselor-portal, and Calm Corner pages are irrelevant to a regular
// feed visitor's session — lazy-loading them keeps those bundles out of the
// path everyone actually hits.
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const FlaggedPostsQueue = lazy(() => import('./pages/admin/FlaggedPostsQueue'));
const ReportsQueue = lazy(() => import('./pages/admin/ReportsQueue'));
const CounselorVerificationList = lazy(() => import('./pages/admin/CounselorVerificationList'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AnalyticsView = lazy(() => import('./pages/admin/AnalyticsView'));
const AuditLog = lazy(() => import('./pages/admin/AuditLog'));
const CounselorLogin = lazy(() => import('./pages/CounselorLogin'));
const CounselorDashboard = lazy(() => import('./pages/CounselorDashboard'));
const CalmCorner = lazy(() => import('./pages/CalmCorner'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVariants = prefersReducedMotion ? reducedFade : fadeRise;

  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<PostFeed />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/posts/new"
                element={
                  <PrivateRoute>
                    <CreatePost />
                  </PrivateRoute>
                }
              />
              <Route path="/threads" element={<ThreadList />} />
              <Route
                path="/threads/new"
                element={
                  <PrivateRoute>
                    <CreateThread />
                  </PrivateRoute>
                }
              />
              <Route path="/threads/:id" element={<ThreadDetail />} />
              <Route path="/inspiration" element={<Inspiration />} />
              <Route path="/calm" element={<CalmCorner />} />
              <Route path="/counselors" element={<CounselorList />} />
              <Route path="/counselors/:id" element={<CounselorProfile />} />
              <Route path="/counselor-login" element={<CounselorLogin />} />
              <Route
                path="/counselor/bookings"
                element={
                  <CounselorPrivateRoute>
                    <CounselorDashboard />
                  </CounselorPrivateRoute>
                }
              />
              <Route path="/guidelines" element={<CommunityGuidelines />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/crisis-resources" element={<CrisisResources />} />
              <Route
                path="/my-activity"
                element={
                  <PrivateRoute>
                    <MyActivity />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="posts" replace />} />
                <Route path="posts" element={<FlaggedPostsQueue />} />
                <Route path="reports" element={<ReportsQueue />} />
                <Route
                  path="counselors"
                  element={
                    <AdminRoute adminOnly>
                      <CounselorVerificationList />
                    </AdminRoute>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <AdminRoute adminOnly>
                      <AdminBookings />
                    </AdminRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <AdminRoute adminOnly>
                      <AnalyticsView />
                    </AdminRoute>
                  }
                />
                <Route
                  path="audit-log"
                  element={
                    <AdminRoute adminOnly>
                      <AuditLog />
                    </AdminRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}

export default App;
