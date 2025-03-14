export const attachQueryParams = (
  baseUrl: string,
  params: Record<string, string | string[] | undefined | number>,
) => {
  const stringifiedParams = Object.entries(params)
    .reduce(
      (
        accParams: URLSearchParams,
        [paramName, paramValue]: [
          string,
          string | string[] | undefined | number,
        ],
      ) => {
        if (paramValue === undefined) {
          return accParams;
        }

        accParams.set(
          paramName,
          Array.isArray(paramValue) ? paramValue.join(',') : String(paramValue),
        );

        return accParams;
      },
      new URLSearchParams(),
    )
    .toString();

  return `${baseUrl}?${stringifiedParams}`;
};
