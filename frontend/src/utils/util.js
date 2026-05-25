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
            backgroundColor: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"],
            borderWidth: 1,
          },
        ],
      };
}

export const formatDataByDate = (data) => {
  const fromatedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return fromatedData;
}