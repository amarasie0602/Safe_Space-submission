import { Link } from 'react-router-dom';
import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';

const NotFound = () => (
  <div className="not-found">
    <ThemedImage
      src={IMAGES.notFound.src}
      alt=""
      width={183}
      height={139}
      sizes="140px"
      overlay={false}
      className="not-found-image"
    />
    <h1>Page not found</h1>
    <p className="text-muted">This page doesn&apos;t exist, but you&apos;re still welcome here.</p>
    <Link to="/" className="btn btn-primary">
      Return to SafeSpace
    </Link>
  </div>
);

export default NotFound;
