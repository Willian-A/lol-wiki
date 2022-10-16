import Head from "next/head";

import { getChampion } from "../api/getChampion";
import capitalize from "../../utils/captilize";

import styles from "../../styles/Champion.module.css";
import { useState } from "react";

function Champion({ champion }) {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);

  const name = capitalize(champion.name);
  const title = capitalize(champion.title);
  const championCoverImage = `http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${champion.id}.png`;

  function RenderSpells() {
    const spellsArray = [champion.passive, ...champion.spells];
    console.log(spellsArray);

    return spellsArray.map((value, index) => {
      const isSelectedSkill = selectedSkillIndex === index;
      let spellImage = `http://ddragon.leagueoflegends.com/cdn/12.18.1/img/spell/${value.image.full}`;
      let isPassive = false;
      let skillButton;

      switch (index) {
        case 0:
          isPassive = true;
          spellImage = `http://ddragon.leagueoflegends.com/cdn/12.18.1/img/passive/${value.image.full}`;
          break;
        case 1:
          skillButton = "Q";
          break;
        case 2:
          skillButton = "W";
          break;
        case 3:
          skillButton = "E";
          break;
        case 4:
          skillButton = "R";
          break;
      }

      return (
        <div className={styles.spell} key={index}>
          <div
            className={
              isSelectedSkill
                ? `${styles.spell_cover}  ${styles.spell_cover_active}`
                : styles.spell_cover
            }
            onClick={() => setSelectedSkillIndex(index)}
          >
            <img src={spellImage} />
            {!isPassive && <h4>{skillButton}</h4>}
          </div>

          {isSelectedSkill && (
            <>
              <h4>{value.name}</h4>
              <p>{value.description}</p>
              {!isPassive && <p>{value.cooldownBurn}</p>}
              {!isPassive && <p>{value.costBurn}</p>}
            </>
          )}
        </div>
      );
    });
  }

  return (
    <div className={styles.champion_container}>
      <Head>
        <title>{name + " - " + title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={styles.background_image}
        style={{
          backgroundImage: `url(
            "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg"
          )`,
        }}
      ></div>

      <div className={styles.main_content}>
        <header>
          <div className={styles.title}>
            <img src={championCoverImage} />
            <div>
              <h1>{name}</h1>
              <h2>{title}</h2>
            </div>
          </div>
          <p>{champion.lore}</p>
        </header>
        {/* <Tilt
        className="Tilt"
        options={{ max: 5, scale: 1 }}
        style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
      > */}
        <div className={styles.spells_container}>
          <RenderSpells />
        </div>
        {/* </Tilt> */}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ params: { id } }) => {
  const { data } = await getChampion(id);
  return {
    props: {
      champion: data[id],
    },
  };
};

export default Champion;
