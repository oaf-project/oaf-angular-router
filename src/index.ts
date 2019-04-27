import { Navigation, NavigationEnd, Router } from "@angular/router";
import {
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";

// tslint:disable: no-expression-statement
// tslint:disable: no-if-statement
// tslint:disable: object-literal-sort-keys

export { RouterSettings } from "oaf-routing";

export const defaultSettings: RouterSettings<Navigation> = {
  ...oafRoutingDefaultSettings,
};

export const wrapRouter = (
  router: Router,
  settingsOverrides?: Partial<RouterSettings<Navigation>>,
): (() => void) => {
  const settings: RouterSettings<Navigation> = {
    ...defaultSettings,
    // TODO support pop page state restoration.
    restorePageStateOnPop: false,
    // We're not restoring page state ourselves so leave this enabled.
    disableAutoScrollRestoration: false,
    ...settingsOverrides,
  };

  const oafRouter = createOafRouter<Navigation>(
    settings,
    navigation => navigation.extractedUrl.fragment || "",
  );

  const initialNavigation = router.getCurrentNavigation();
  if (initialNavigation !== null) {
    oafRouter.handleFirstPageLoad(initialNavigation);
  }

  const subscription = router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const navigation = router.getCurrentNavigation();
      const previousNavigation =
        navigation !== null ? navigation.previousNavigation : null;

      if (navigation !== null && previousNavigation !== null) {
        oafRouter.handleLocationChanged(
          previousNavigation,
          navigation,
          undefined,
          undefined,
        );
      }
    }
  });

  return () => {
    oafRouter.resetAutoScrollRestoration();
    subscription.unsubscribe();
  };
};
