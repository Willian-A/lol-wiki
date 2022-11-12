import { useState, useEffect } from "react";
import Head from "next/head";

import { getChampions } from "./api/getChampions";

import styles from "../styles/Home.module.css";
import CanvasModel from "../components/shared/CanvasModel";
import ChampionsList from "../components/pages/index/ChampionsList";

import useDebounce from "../utils/hooks/useDebouce";
import formatChampionsList from "../utils/functions/formatChampionsList";

export default function Home({ champions }) {
  const [formatedChampionsArray, setFormatedChampionsArray] = useState([]);

  useEffect(() => {
    setFormatedChampionsArray(formatChampionsList(champions));
  }, [champions]);

  function handleSearch({ target }) {
    function serachChampions(search) {
      if (search.length > 0) {
        const allChampionsArray = formatChampionsList(champions);
        const searchChapionsList = allChampionsArray.filter((champion) => {
          return champion.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        });
        setFormatedChampionsArray(searchChapionsList);
      } else {
        setFormatedChampionsArray(formatChampionsList(champions));
      }
    }

    useDebounce(target.value, serachChampions);
  }

  return (
    <div>
      <Head>
        <title>Next and LoL API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.main_text}>
          <h1>Lorem ipsum dolor sit amet elit</h1>
          <h2>
            Duis mattis metus vel nisl laoreet euismod. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos.
          </h2>
          <p>Suspendisse tellus nibh, faucibus eu purus vitae, fringilla.</p>
        </div>
        <CanvasModel className={styles.champion_animation} />
      </header>

      <main className={styles.champions_container}>
        <h1>Champions</h1>
        <input
          className={styles.search_bar}
          onChange={handleSearch}
          placeholder="Pesquisar por campeões (Ex: Shen, Trundle, etc...)"
        />
        <ChampionsList
          list={formatedChampionsArray}
          styles={{
            grid: styles.grid,
            champion: styles.champion,
            frame: styles.frame,
          }}
        />
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const { data } = await getChampions();
  return {
    props: {
      champions: data,
    },
  };
};
