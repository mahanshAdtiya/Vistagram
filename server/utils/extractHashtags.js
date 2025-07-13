export const extractHashtags = (text) => {
  const regex = /#\w+/g;
  return text.match(regex)?.map(tag => tag.slice(1).toLowerCase()) || [];
};
