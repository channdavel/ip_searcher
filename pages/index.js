import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ChevronRight, Loader } from 'lucide-react';
import Card from '@/components/Card';
import Map from '@/components/Map';
import Alert from '@/components/Alert';
import Footer from '@/components/Footer';

export default function Home() {
  const [ip, setIp] = useState('');
  const [data, setData] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [finished, setFinished] = useState(true);

  useEffect(() => {
    const initIp = async () => {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setData(data);
    };
    initIp();
  }, []);

  const handleInput = (ip) => {
    let newIp = '';
    for (let i = 0; i < ip.length; i++) {
      if (ip[i] !== ' ') {
        newIp += ip[i];
      }
    }
    return newIp;
  };

  const fetchIp = async (e) => {
    e.preventDefault();
    const newIp = handleInput(ip);
    const url = `https://ipapi.co/${newIp}/json/`;
    const response = await fetch(url);
    const data = await response.json();
    if (ip === '' || data.error) {
      setFinished(true);
      setOpenToast(true);
      if (openToast) {
        setOpenToast(false);
        setTimeout(() => {
          setOpenToast(true);
        }, 350);
      }
      return;
    } else {
      setOpenToast(false);
    }
    setData(data);
    setIp('');
    setFinished(true);
  };

  return (
    <>
      <Head>
        <title>IP Address Finder</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-[100svh] relative">
        <div className="w-full absolute -z-20 h-screen bg-black"></div>
        <div className="flex tracking-[-0.04em] md:tracking-normal justify-center items-center pt-8 text-3xl text-white font-bold">
          <h1>IP Address Finder</h1>
        </div>
        <form
          onSubmit={fetchIp}
          className="flex justify-center items-center mt-6 max-w-xs md:max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for any IP address"
            className="p-4 rounded-xl rounded-r-none max-h-[57px] w-full border-r focus:outline-none text-lg"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <button
            className="p-4 bg-white rounded-r-xl max-h-[57px] max-w-[57px] w-full flex items-center hover:bg-[#f4f4f4] transition"
            onClick={() => setFinished(false)}>
            {finished ? (
              <ChevronRight color="black" size={40} />
            ) : (
              <Loader color="black" size={40} className="animate-spin" />
            )}
          </button>
        </form>
        <Alert open={openToast} setOpen={setOpenToast} />
        <Card data={data} />
        <Map data={data} />
        <div className="flex justify-center items-center">
          <Footer />
        </div>
      </main>
    </>
  );
}
