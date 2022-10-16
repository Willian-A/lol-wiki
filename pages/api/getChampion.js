import axios from "axios";

export async function getChampion(id) {
  const champion = await axios
    .get(
      `http://ddragon.leagueoflegends.com/cdn/12.17.1/data/en_US/champion/${id}.json`
    )
    .then((res) => {
      return res.data;
    });

  return champion;
}
