import axios from "axios";

export async function getChampions() {
  const champion = await axios
    .get(
      "https://ddragon.leagueoflegends.com/cdn/12.17.1/data/en_US/champion.json"
    )
    .then((res) => {
      return res.data;
    });

  return champion;
}
