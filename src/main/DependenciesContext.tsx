import { createContext, type PropsWithChildren, useContext } from "react";

import type { AppDependencies } from "@/main/createAppDependencies";

const DependenciesContext = createContext<AppDependencies | null>(null);

type DependenciesProviderProps = PropsWithChildren<
  Readonly<{
    dependencies: AppDependencies;
  }>
>;

export function DependenciesProvider({
  children,
  dependencies
}: DependenciesProviderProps) {
  return (
    <DependenciesContext.Provider value={dependencies}>
      {children}
    </DependenciesContext.Provider>
  );
}

export function useDependencies(): AppDependencies {
  const dependencies = useContext(DependenciesContext);

  if (!dependencies) {
    throw new Error("Les dependances de l'application ne sont pas initialisees.");
  }

  return dependencies;
}
