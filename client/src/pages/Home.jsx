import Header from '../component/Header';
import Jumbotron from '../component/Jumbotron';
import FooterCard from '../component/Card';

function Home() {
  return (
    <div className="Home">
      <Header />
      <Jumbotron />
      <FooterCard />
    </div>
  );
}

export default Home;