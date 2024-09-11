"use client";

import { useEffect, useRef } from "react";
// import { Sidetab } from "@typeform/embed-react";
import { usePathname } from "next/navigation";

import { GLOBAL_TITLE, PAGES_BY_ROUTE } from "@/constants";
// import { useIsFetching } from '@/utils/reactQuery'

// import Divider from '../Divider'
// import Header from '../Header'
// import Loading from '../Loading'
// import Title from '../Title'
// import ServiceStatus from './ServiceStatus'

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = (props: LayoutProps) => {
  const currentPath = usePathname();
  const [_, route, stage] = currentPath?.split("/") || [];

  const projectSettings = PAGES_BY_ROUTE[`/${route}`];

  const isHomePage = !route;
  const isStartPage = stage === "start" && !isHomePage;

  //   const isFetching = useIsFetching();

  const origin = useRef("");
  useEffect(() => {
    origin.current = window.location.origin;
  }, []);

  return (
    <main className="h-dvh overflow-auto flex flex-col items-stretch relative">
      {/* {currentPath !== "/" && (
        <Sidetab
          id="cMw26fRA"
          buttonText="Feedback"
          buttonColor="#363636BF"
          buttonWidth={36}
          buttonTextSize={16}
          hidden={{
            url: `${origin.current}${currentPath}`,
          }}
        />
      )}
      {isFetching ? <Loading /> : null}
      <Header>
        {!isStartPage && projectSettings && (
          <>
            <Divider />
            <Title
              variant="compact"
              title={projectSettings.title}
              icon={projectSettings.icon}
            />
          </>
        )}
        {isHomePage && (
          <>
            <Divider />
            <Title variant="compact" title={GLOBAL_TITLE} icon="" />
          </>
        )}
        {!isHomePage && projectSettings && (
          <ServiceStatus services={projectSettings.services} />
        )}
      </Header>

      <div className="flex-1 flex flex-col items-center overflow-auto">
        {isStartPage && (
          <Title
            variant="full"
            title={projectSettings.title}
            description={projectSettings.description}
            icon={projectSettings.icon}
          />
        )}
        {props.children}
      </div> */}
      <div>{props.children}</div>
    </main>
  );
};

export default Layout;
