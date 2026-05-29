const colorMap = {
  0: "orange",
  1: "green",
  2: "blue",
};

export const getColor = (id: string) => {
  return colorMap[id.charCodeAt(0) % 3 as keyof typeof colorMap];
};

const useColor = () => ({ getColor });

export default useColor;