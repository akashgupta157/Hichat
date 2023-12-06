export const setPageLoad = (isPageLoaded) => {
  return {
    type: "SET_PAGE_LOAD",
    payload: isPageLoaded,
  };
};
