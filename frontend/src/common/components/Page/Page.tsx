import Header from './Header/Header';
import Footer from './Footer/Footer';

interface IPageProps {
  children: JSX.Element;
}

export default function Page({ children }: IPageProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="my-5">{children}</div>
      <Footer />
    </div>
  );
}