import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import PageLoader from './components/PageLoader.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const RequestProduct = lazy(() => import('./pages/RequestProduct.jsx'));
const RequestStatus = lazy(() => import('./pages/RequestStatus.jsx'));
const RequestHistory = lazy(() => import('./pages/RequestHistory.jsx'));
const HowItWorks = lazy(() => import('./pages/HowItWorks.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const ProhibitedItemsPolicy = lazy(() => import('./pages/ProhibitedItemsPolicy.jsx'));
const GalleryDetail = lazy(() => import('./pages/GalleryDetail.jsx'));
const BecomeRider = lazy(() => import('./pages/BecomeRider.jsx'));
const RiderRegister = lazy(() => import('./pages/RiderRegister.jsx'));
const RiderStatus = lazy(() => import('./pages/RiderStatus.jsx'));
const BecomeFranchise = lazy(() => import('./pages/BecomeFranchise.jsx'));
const FranchiseRegister = lazy(() => import('./pages/FranchiseRegister.jsx'));
const FranchiseStatus = lazy(() => import('./pages/FranchiseStatus.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="admin" element={<Admin />} />
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="request" element={<RequestProduct />} />
          <Route path="request/status" element={<RequestStatus />} />
          <Route path="request/history" element={<RequestHistory />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="prohibited-items-policy" element={<ProhibitedItemsPolicy />} />
          <Route path="gallery/:slug" element={<GalleryDetail />} />
          <Route path="become-a-rider" element={<BecomeRider />} />
          <Route path="rider/register" element={<RiderRegister />} />
          <Route path="rider/status" element={<RiderStatus />} />
          <Route path="become-a-franchise" element={<BecomeFranchise />} />
          <Route path="franchise/register" element={<FranchiseRegister />} />
          <Route path="franchise/status" element={<FranchiseStatus />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
