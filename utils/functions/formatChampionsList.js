export default function formatChampionsList(champions) {
  const formatedChampions = [];

  for (let i = 0; i < Object.keys(champions).length; i++) {
    const index = Object.keys(champions)[i];
    const champion = champions[index];
    formatedChampions.push(champion);
  }

  return formatedChampions;
}
