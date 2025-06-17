import { useEffect, useMemo, useState } from 'react';
import { ChoccyAdmin } from '../!autogen/api'

const Home: React.FC = () => {
  const api = useMemo(() => new ChoccyAdmin.Server.Controllers.HomeController(), []);
  const [content, setContent] = useState<string>();

  useEffect(() => {
    api.index().then(s => {
      console.log(s);
      setContent(s?.name);
    });
  }, []);

  return <span> {content} </span>
};

export default Home;
