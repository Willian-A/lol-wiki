import Link from "next/link";

function ChampionsList({ list, styles }) {
  function RenderChampionsGrid() {
    if (list.length) {
      return (
        <div className={styles.grid}>
          {list.map((champ, i) => {
            const championCoverImage = `http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${champ.id}.png`;

            return (
              <Link key={i} href={`champion/${champ.id}`}>
                <div className={styles.champion}>
                  <div className={styles.frame}>
                    <img src={championCoverImage} />
                  </div>
                  <h4>{champ.name}</h4>
                </div>
              </Link>
            );
          })}
        </div>
      );
    }

    return <h3 style={{ textAlign: "center" }}>Nenhum campeão encontrado</h3>;
  }

  return <RenderChampionsGrid />;
}

export default ChampionsList;
