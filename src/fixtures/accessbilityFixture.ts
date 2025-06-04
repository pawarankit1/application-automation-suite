import { test as base, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";


// This is a fixture that will be used to run accessibility tests
export const test = base.extend<{accessibilityBuilder: AxeBuilder}>({
    accessibilityBuilder: async ({page}, use) => {
        const accessibilityBuilder = new AxeBuilder({page})
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
        await use(accessibilityBuilder);
    },
});



export { expect } from "@playwright/test";