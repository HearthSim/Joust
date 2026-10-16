import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const root = dirname(fileURLToPath(import.meta.url));
const enums = resolve(root, "ts/enums");

export default defineConfig({
	plugins: [
		{
			// enums.d.ts only declares const enums, so provide them as real enums at runtime
			name: "enums",
			enforce: "pre",
			resolveId(id, importer) {
				if (importer && resolve(dirname(importer), id) === enums) {
					return enums + ".ts";
				}
			},
			load(id) {
				if (id === enums + ".ts") {
					return readFileSync(enums + ".d.ts", "utf8").replace(
						/export const enum/g,
						"export enum",
					);
				}
			},
		},
	],
	test: {
		include: ["ts/**/*.spec.{ts,tsx}"],
	},
});
