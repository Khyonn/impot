import { type JSXElement, createContext, useContext, onCleanup } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";

type Primitiv = boolean | string | number;

const SearchContext = createContext<[ReturnType<typeof createStore>[0], (params: Record<string, Primitiv[]>) => void]>([
  {},
  () => {},
]);

const getSearchParams = () => {
  return [...new URLSearchParams(location.search).entries()].reduce((acc, [propName, propValue]) => {
    if (acc[propName]) {
      if (!Array.isArray(acc[propName])) {
        acc[propName] = [acc[propName] as string, propValue];
      } else {
        (acc[propName] as string[]).push(propValue);
      }
    } else {
      acc[propName] = propValue;
    }
    return acc;
  }, {} as Record<string, string | string[]>);
};

export function useSearchParams<T>() {
  return useContext(SearchContext) as [Partial<T>, (params: Record<string, string | string[] | undefined>) => void];
}

export function SearchParamsProvider(props: { children: JSXElement }) {
  const [value, setValue] = createStore<Record<string, string | string[]>>(getSearchParams());

  const reflectOnUrl = () => {
    const search = new URLSearchParams();
    Object.entries(value).forEach(([paramName, paramValue]) => {
      if (Array.isArray(paramValue)) {
        paramValue.forEach((subValue) => {
          search.append(paramName, subValue);
        });
      } else {
        search.append(paramName, paramValue);
      }
    });
    const newURL = new URL(location.href);
    newURL.search = search.toString();
    history.pushState(null, "", newURL);
  };
  const reflectOnStore = () => {
    setValue(reconcile(getSearchParams()));
  };

  addEventListener("popstate", reflectOnStore);

  onCleanup(() => {
    removeEventListener("popstate", reflectOnStore);
  });

  return (
    <SearchContext.Provider
      value={[
        value,
        (params) => {
          setValue(
            produce((old) =>
              Object.assign(
                old,
                Object.fromEntries(
                  Object.entries(params).map(([paramName, paramValue]) => [
                    paramName,
                    Array.isArray(paramValue) ? paramValue.map(String) : String(paramValue),
                  ])
                )
              )
            )
          );
          reflectOnUrl();
        },
      ]}
    >
      {props.children}
    </SearchContext.Provider>
  );
}
