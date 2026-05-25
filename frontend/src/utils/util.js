export const saveSelectedOption = (pollId, seletedOptionId) => {
    localStorage.setItem(pollId, seletedOptionId);
}

export const getSelectedOption = (pollId) => {
    const selecetedId = localStorage.getItem(pollId);
    return selecetedId;
}

export const makeChartDataObjFromPollData = (poll) => {
    return {
        labels: poll?.data?.pollData?.options.map(option => option.name),
        datasets: [
          {
            label: "Votes",
            data: poll?.data?.pollData?.options.map(option => option.voteCount),
            backgroundColor: ["#3B82F6", "#06B6D4", "#60A5FA", "#22D3EE", "#1D4ED8", "#0891B2"],
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      };
}

export const formatDataByDate = (data) => {
  const fromatedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return fromatedData;
}